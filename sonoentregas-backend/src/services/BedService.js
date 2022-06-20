const Bed = require('../models/tables/Bed')
const ViewBedFeed = require('../models/views/ViewBedFeed')

module.exports = {
  async findBed(){
    const beds = await Bed.findAll(0)

    const bedFeeds = await ViewBedFeed.findAll(0)

    if (beds.length > 0) {
      beds.forEach(bed => {
        bed['nameClass'] = ''
        bed['bedsFeed'] = []

        bedFeeds.forEach(bedFeed => {
          bedFeed.ID === bed.ID && bed.bedsFeed.push(bedFeed)
        })
      })
    }

    return beds
  }
}