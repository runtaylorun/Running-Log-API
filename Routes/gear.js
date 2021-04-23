const { getUserGear, createNewGear } = require('../Services/gear');

module.exports = (app) => {
    app.get('/gear', async (req, res) => {
        const userId = req?.user?.id;

        try {
            const gear = await getUserGear(userId);

            res.status(200).send(gear);
        } catch (error) {
            console.log('Error getting user gear', error);
        }
    });

    app.post('/gear', async (req, res) => {
        const userId = req?.user?.id;

        const { gear } = req.body

        try {
            await createNewGear(userId, gear)
            res.status(201).send('Activity Created')
        } catch (error) {
            console.log(error)
        }
    })
};