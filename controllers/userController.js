const { User } = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a single user by its _id and populate thought and friend data
exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await User.create({ username, email });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a user by its _id
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a user by its _id
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add a friend to a user's friend list
exports.addFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Remove a friend from a user's friend list
exports.removeFriend = async (req, res) => {
  const { userId, friendId } = req.params;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { friends: friendId } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
