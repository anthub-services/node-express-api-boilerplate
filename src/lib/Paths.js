import DB from '../models'

export function create(options) {
  const { res, body, userId } = options
  const value = {
    allowedPaths: body.allowedPaths,
    excludedPaths: body.excludedPaths,
  }

  DB.Path
    .create({ userId, value })
    .then(Path => {
      const data = Path ? { userId } : null

      return res.status(Path ? 201 : 400).send(data)
    })
    .catch(error => {
      console.log(error)

      res.status(400).send(error)
    })
}

export function update(options) {
  const { res, body, userId } = options
  const value = {
    allowedPaths: body.allowedPaths,
    excludedPaths: body.excludedPaths,
  }

  DB.Path
    .update({ value }, {
      where: { userId }
    })
    .then(Path => {
      return res.status(Path ? 200 : 400).send()
    })
    .catch(error => {
      console.log(error)

      res.status(400).send(error)
    })
}
