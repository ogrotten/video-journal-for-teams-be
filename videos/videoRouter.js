const express = require("express");
const router = express.Router();

const Videos = require("../videos/videoModel.js");

const { validateVideoId, validateFeedback } = require("../middleware/middleware");


const tempfile = `TEMP-${Date.now()}`
const multer = require('multer')
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/')
	},
	filename: (req, file, cb) => {
		cb(null, tempfile)
	}
})
const upload = multer({ storage: storage })


// 1. Fetch all videos
router.get("/", (req, res) => {
	Videos.find()
		.then((videos) => res.status(200).json(videos))
		.catch((err) => res.status(500).json({ message: "Could not get videos.", error: err }));
});

// 2. Fetch video by id
router.get("/:id", validateVideoId, (req, res) => {
	const { id } = req.params;

	Videos.findById(id)
		.then((video) => res.status(200).json(video))
		.catch((err) => res.status(500).json({ message: `Could not get video ${id}.`, error: err }));
});

// 3. Fetch feedback by video id
router.get("/:id/feedback", validateVideoId, (req, res) => {
	const { id } = req.params;

	Videos.findFeedbackByVideoId(id)
		.then((feedback) => res.status(200).json(feedback))
		.catch((err) => res.status(500).json({ message: `Could not get feedback for video ${id}.`, error: err }));
});

// 4. Add video feedback
router.post("/:id/feedback", validateVideoId, validateFeedback, (req, res) => {
	const { id } = req.params;
	req.feedback.video_id = id;

	Videos.insertFeedback(req.feedback)
		.then((feedbackId) => {
			res.status(201).json(feedbackId);
		})
		.catch((err) => {
			if (err.code === "23503") {
				res.status(422).json({ message: `Video ${id} does not exist`, error: err });
			} else {
				res.status(500).json({ message: `Could not add feedback to video ${id}.`, error: err });
			}
		});
});

// 5. Add a new video
router.post("/", upload.single("alpacafile"), (req, res) => {
	//#region
	/* 

	req.body should be an object in this form
	{
		"owner_id": 73,
		"title": "Removal of Drainage Device from Peritoneum, Open Approach",
		"description": "Removal of Drainage Device from Peritoneum, Open Approach",
		"created_at": "2020-01-14 14:32:15",
		"updated_at": "2019-01-24 03:09:02",
		"video_url": "http://dummyimage.com/204x108.jpg/5fa2dd/ffffff",
		"prompt_id": 6
	}

	REQUIREMENTS:
		* owner_id and prompt_id must be from the same team
		* owner_id DOES NOT need team admin permission
		* owner_id MUST be logged in and Authz Token in header

	*/
	//#endregion

	// These 2 lines will be the ones to use
		// let vidData = req.body
		// vidData.video_url = req.file.filename

	// temporary sample data for trying DB activity until I get an object from FE.

	let vidData = 	{
		owner_id : 73,
		title : "Removal of Drainage",
		description : "Removal of Drainage Device from Peritoneum, Open Approach",
		video_url : req.file.filename,
		prompt_id : 6
	}

	Videos.insert(vidData)
		.then((video) => res.status(201).json({ message: "Video creation successful.", id: video[0] }))
		.catch((err) => {
			console.log(107,err)
			res.status(500).json({ message: "Could not insert new video.", error: err })
		});
});

// 6. Update a video
router.put("/", (req, res) => {
	/* 

	req.body should be an object in the same form as router.POST

	REQUIREMENTS:
		* The JSON object MUST contain video.id 
		* Same as router.post

	*/
	Videos.update(req.body)
		.then((video) => res.status(200).json({ message: "Video meta-data edit successful.", video: video }))
		.catch((err) => res.status(500).json({ message: "Could not edit existing video.", error: err }));
});

module.exports = router;