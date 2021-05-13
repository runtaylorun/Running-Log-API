const toActivityCode = (type) => {
  switch (type.toLowerCase()) {
    case 'running':
      return 1
    default:
      return 1
  }
}

module.exports = {
  toActivityCode
}
