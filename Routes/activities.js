const { getUserActivities, getUserActivityById, createNewActivity, updateActivity } = require('../Services/activities');

module.exports = (app) => {
  app.post('/activities', async (req, res) => {
    const { activity } = req.body;

    const userId = req?.user?.id ?? 0;

    const newActivity = {
      ...activity,
      userId
    };

    try {
      await createNewActivity(newActivity);
      res.status(201).send('Activity created');
    } catch (error) {
      console.log('Error creating new activity');
    }
  });

  app.put('/activities/:activityId', async (req, res) => {
    const { activity } = req.body;

    try {
      await updateActivity(activity);
      res.status(201).send('Activity updated');
    } catch (error) {
      console.log('error updating activity', error);
    }

  });

  app.delete('/activities/:activityId', async (req, res) => { });

  app.get('/activities', async (req, res) => {
    const userId = req?.user?.id ?? 0;

    const query = {
      month: req.query.month || null,
      year: req.query.year || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null
    };


    try {
      await getUserActivities(userId, query, (activities) => {
        res.status(200).send(activities);
      });
    } catch (error) {
      res.status(400).send('Error getting activities');
    }
  });

  app.get('/activities/:activityId', async (req, res) => {
    const { activityId } = req.params;
    const userId = req?.user?.id ?? 0;


    try {
      await getUserActivityById(userId, activityId, (activities) => {
        console.log(activities)
        res.status(200).send(activities);
      });
    } catch (error) {
      res.status(400).send('Error getting activities');
    }
  });

};
