const Profile = require('../models/Profile');

const saveProfile = async (req, res) => {
    try {
        const { age, gender, medicalHistory } = req.body;
        let profile = await Profile.findOne({ userId: req.user.id });
        if (profile) {
            profile.age = age; profile.gender = gender; profile.medicalHistory = medicalHistory;
            await profile.save();
        } else {
            profile = new Profile({ userId: req.user.id, age, gender, medicalHistory });
            await profile.save();
        }
        res.status(200).json({ message: "Profile saved successfully", profile });
    } catch (err) { res.status(500).json({ error: "Server error" }); }
};

const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user.id });
        res.status(200).json(profile || {});
    } catch (err) { res.status(500).json({ error: "Server error" }); }
};

module.exports = { saveProfile, getProfile };