import generateToken from '../utils/generateToken.js';

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Check user in database (example)
    const user = await User.findOne({ where: { email } });
    
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
