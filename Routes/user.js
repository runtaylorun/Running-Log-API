const { patchUserPreferences, getUserDetails } = require('../services/user')

module.exports = (app) => {
  app.get('/users/userDetails', async (req, res) => {
    const userId = req?.user?.id ?? 0

    try {
      const userDetails = await getUserDetails(userId)

      res.status(200).send(userDetails)
    } catch (error) {
      res.status(500).send({ message: 'Error getting user details' })
      console.log(error)
    }
  })

  app.patch('/users/userDetails', async (req, res) => {
    const userId = req?.user?.id
    const { changes } = req.body

    try {
      await patchUserPreferences(userId, changes)

      res.status(200).send({ message: 'Updated user' })
    } catch (error) {
      res.status(500).send({ message: 'Error updating user' })
      console.log(error)
    }
  })
}
