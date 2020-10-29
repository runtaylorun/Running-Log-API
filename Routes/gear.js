const database = require('../DB/database');
const { getUserGear } = require('../Services/gear');

module.exports = (app) => {
    app.get('/gear/:userId', async (req, res) => {
        const { userId } = req.params;

        try {
            await getUserGear(userId, (gear) => {
                res.status(200).send(gear);
            });
        } catch (error) {
            console.log('Error getting user gear', error);
        }
    });
};