const { Thought } = require('../models/Thought');
const { User } = require('../models/User');

// Create a new thought
exports.createThought = async (req, res) => {
    const { thoughtText, username, userId } = req.body;
    try {
        const thought = await Thought.create({ thoughtText, username });
        // Push the created thought's _id to the associated user's thoughts array field
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: thought._id } },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(201).json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a thought by its _id
exports.updateThought = async (req, res) => {
    const { thoughtId } = req.params;
    const { thoughtText } = req.body;
    try {
        const thought = await Thought.findByIdAndUpdate(
            thoughtId,
            { thoughtText },
            { new: true }
        );
        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Remove a thought by its _id
exports.removeThought = async (req, res) => {
    const { thoughtId } = req.params;
    try {
        const thought = await Thought.findByIdAndDelete(thoughtId);
        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }
        // Remove the thought's _id from the associated user's thoughts array field
        await User.updateMany({}, { $pull: { thoughts: thoughtId } });
        res.json({ message: 'Thought deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a reaction and store it in a single thought's reactions array field
exports.createReaction = async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }
        // Push the new reaction to the thought's reactions array field
        thought.reactions.push({ reactionBody, username });
        await thought.save();
        res.status(201).json(thought);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Pull and remove a reaction from a single thought's reactions array field by the reaction's reactionId value
exports.removeReaction = async (req, res) => {
    const { thoughtId } = req.params;
    const { reactionId } = req.body;
    try {
        const thought = await Thought.findById(thoughtId);
        if (!thought) {
            return res.status(404).json({ error: 'Thought not found' });
        }
        // Pull and remove the reaction from the thought's reactions array field
        thought.reactions.pull({ _id: reactionId });
        await thought.save();
        res.json(thought);
    } catch (err) {
        console.error(err);
        res.status(500)
            .json({ error: 'Server error' });
    }
}
