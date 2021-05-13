const formidable = require('formidable')
const {
  getUserActivities,
  getUserActivityById,
  createNewActivity,
  updateActivity,
  checkIfActivityExists,
  getUserActivityCount
} = require('../Services/activities')
const { getActivityFromTcx, getActivityFromGpx, getActivityFromFit } = require('../Services/activityFiles')

module.exports = (app) => {
  app.post('/activities', async (req, res) => {
    const { activity } = req.body
    const userId = req?.user?.id ?? 0

    const newActivity = {
      ...activity,
      userId
    }

    try {
      await createNewActivity(newActivity)
      res.status(201).send('Activity created')
    } catch (error) {
      res.status(500).send({ message: 'Error creating new activity' })
      console.log(error)
    }
  })

  app.post('/activities/fileUpload', async (req, res) => {
    const form = new formidable.IncomingForm()
    const userId = req?.user?.id ?? 0

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).send({ message: 'Error uploading file' })
      }

      const { file } = files
      let activity

      if (file.name.includes('.tcx')) {
        activity = await getActivityFromTcx(file)
      }

      if (file.name.includes('.gpx')) {
        activity = await getActivityFromGpx(file)
      }

      if (file.name.includes('.fit')) {
        activity = await getActivityFromFit(file)
      }

      try {
        const activityExists = await checkIfActivityExists(activity.fileId)
        if (activityExists.length) {
          return res.status(500).send({ message: 'Activity already exists' })
        }

        await createNewActivity({ ...activity, userId })
        res.status(200).send({ message: 'Activity uploaded' })
      } catch (error) {
        res.status(500).send({ message: 'Error uploading file' })
        console.log(error)
      }
    })
  })

  app.put('/activities/:activityId', async (req, res) => {
    const { activity } = req.body

    try {
      await updateActivity(activity)
      res.status(200).send({ message: 'Activity updated' })
    } catch (error) {
      res.status(500).send({ message: 'Error updating activity' })
      console.log(error)
    }
  })

  app.delete('/activities/:activityId', async (req, res) => { })

  app.get('/activities', async (req, res) => {
    const userId = req?.user?.id ?? 0

    const query = {
      month: req?.query?.month,
      year: req?.query?.year,
      startDate: req?.query?.startDate,
      endDate: req?.query?.endDate,
      type: req?.query?.type,
      limit: req?.query?.limit,
      offset: req?.query?.offset,
      searchTerm: req?.query?.searchTerm,
      column: req?.query?.column,
      sortDirection: req?.query?.sortDirection
    }

    try {
      const activities = await getUserActivities(userId, query)
      const count = await getUserActivityCount(userId)
      const pages = req?.query?.limit ? Math.ceil(count / req.query.limit) : 0

      res.status(200).send({ activities, count, pages })
    } catch (error) {
      res.status(500).send({ message: 'Error getting activities' })
      console.log(error)
    }
  })

  app.get('/activities/:activityId', async (req, res) => {
    const { activityId } = req.params
    const userId = req?.user?.id ?? 0

    try {
      const activity = await getUserActivityById(userId, activityId)

      res.status(200).send(activity)
    } catch (error) {
      res.status(500).send({ message: 'Error getting activities' })
      console.log(error)
    }
  })
}
