const { getUserGear, getGearById, patchGear, updateGear, createNewGear, deleteGear, updateRunsWithDeletedGear } = require('../Services/gear')

module.exports = (app) => {
  app.get('/gear', async (req, res) => {
    const userId = req?.user?.id

    const query = {
      ...req.query
    }

    try {
      const gear = await getUserGear(userId, query)

      res.status(200).send(gear)
    } catch (error) {
      res.status(500).send({ message: 'Error getting gear' })
      console.log(error)
    }
  })

  app.post('/gear', async (req, res) => {
    const userId = req?.user?.id
    const { gear } = req.body

    console.log(gear)

    try {
      await createNewGear(userId, gear)
      res.status(201).send({ message: 'gear created' })
    } catch (error) {
      res.status(500).send({ message: 'Error creating gear' })
      console.log(error)
    }
  })

  app.get('/gear/:gearId', async (req, res) => {
    const userId = req?.user?.id ?? 0
    const gearId = req?.params?.gearId

    try {
      const gear = await getGearById(userId, gearId)

      res.status(200).send(gear)
    } catch (error) {
      res.status(500).send({ message: 'Error getting gear' })
      console.log(error)
    };
  })

  app.put('/gear', async (req, res) => {
    const userId = req?.user?.id
    const { gear } = req.body

    try {
      await updateGear(userId, gear)

      res.status(200).send({ message: 'gear updated' })
    } catch (error) {
      res.status(500).send({ message: 'Error updating gear' })
      console.log(error)
    }
  })

  app.patch('/gear/:gearId', async (req, res) => {
    const gearId = req?.params?.gearId
    const { changes } = req.body

    try {
      await patchGear(gearId, changes)

      res.status(200).send({ message: 'Gear updated' })
    } catch (error) {
      res.status(500).send({ message: 'Error updating gear' })
      console.log(error)
    }
  })

  app.delete('/gear/:gearId', async (req, res) => {
    const userId = req?.user?.id
    const gearId = req?.params?.gearId

    try {
      await deleteGear(userId, gearId)
      await updateRunsWithDeletedGear(userId, gearId)
      res.status(200).send({ message: 'activity deleted' })
    } catch (error) {
      res.status(500).send({ message: 'Error deleting gear' })
      console.log(error)
    }
  })
}
