import DB from '../models'

export function find(res, options) {
  const { where, returnData } = options

  return DB.User
    .findOne({ where,
      include: [{
        model: DB.Permission,
        as: 'Permissions',
        through: 'UserPermission'
      }]
    })
    .then(User => {
      const json = User ?
        {
          userId: User.userId,
          firstName: User.firstName,
          lastName: User.lastName,
          status: User.status,
          redirect: User.redirect,
          allowedPaths: User.permissions().allowedPaths,
          excludedPaths: User.permissions().excludedPaths
        } : null

      if (returnData) return { object: User, json }

      return res.status(User ? 200 : 404).send(json)
    })
    .catch(error => {
      console.log(error)

      return returnData ? error : res.status(400).send(error)
    })
}
