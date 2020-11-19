const database = require('../DB/database');
const { getUserGear, createNewGear } = require('../Services/gear');

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

    app.post('/gear/:userId', async (req, res) => {
        const { userId } = req.params;
        const { gear } = req.body

        try {
            await createNewGear(userId, gear)

            res.status(201).send('Activity Created')
        } catch (error) {
            console.log(error)
        }
    })
};