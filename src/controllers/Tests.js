export default {
  list(req, res) {
    res.status(200).send({
      message: 'List of records.'
    })
  },

  create(req, res) {
    res.status(201).send({
      message: 'Record created.'
    })
  },

  find(req, res) {
    res.status(200).send({
      id: req.params.id,
      message: 'Record data.'
    })

    // For data not found
    // res.status(404).send({
    //   message: 'Record data not found.'
    // })
  },

  update(req, res) {
    res.status(200).send({
      id: req.params.id,
      message: 'Record updated.'
    })
  },

  destroy(req, res) {
    res.status(200).send({
      id: req.params.id,
      message: 'Record deleted.'
    })
  },

  customMethod(req, res) {
    // Status code can be 200, 201, or 404 - see the statuses above
    res.status(200).send({
      message: 'Custom action for the record.'
    })
  }
}

// NOTE: See more status codes here: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
