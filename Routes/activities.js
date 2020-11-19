const database = require('../DB/database')
const { getUserActivities, getUserActivityById, createNewActivity, updateActivity } = require('../Services/activities')

const connection = database.getConnection()

module.exports = (app) => {
  app.post('/activity', async (req, res) => {
    const { activity } = req.body

    try {
      await createNewActivity(activity)
      res.status(201).send('Activity created')
    } catch (error) {
      console.log('Error creating new activity')
    }
  })

  app.get('/activity/:userId', async (req, res) => {
    const { userId } = req.params
    const query = {
      month: req.query.month || null,
      year: req.query.year || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null
    }

    try {
      await getUserActivities(userId, query, (activities) => {
        res.status(200).send(activities)
      })
    } catch (error) {
      res.status(400).send('Error getting activities')
    }
  })

  app.get('/activity/:userId/:activityId', async (req, res) => {
    const { userId, activityId } = req.params

    try {
      await getUserActivityById(userId, activityId, (activities) => {
        res.status(200).send(activities)
      })
    } catch (error) {
      res.status(400).send('Error getting activities')
    }
  })

  app.put('/activity/:id', async (req, res) => {
    const { activity } = req.body

    try {
      await updateActivity(activity)
      res.status(201).send('Activity updated')
    } catch (error) {
      console.log('error updating activity', error)
    }

  })

  app.delete('/activity/:id', async (req, res) => { })
}
