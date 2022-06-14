module.exports = {
  async findFeed(FeedsModel){
    const FdSk = await FeedsModel.findAll(0)

    if (FdSk.length > 0) {
      FdSk.forEach(el => {
        el['nameClass'] = ''
      })
    }

    return FdSk
  }
}