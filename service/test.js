const { db, models } = require('../models')

class TestService {
    static getInstance() {
        if (!this.instance) {
            this.instance = new TestService()
        }
        return this.instance
    }

    async getUserInfo(id) {
        const user = await models.user.findById(id)
        return user
    }
}

module.exports = TestService.getInstance()