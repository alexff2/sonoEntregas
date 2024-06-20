//@ts-check

class TransferOfProductRules {
  /**
   * @param {import("../services/TransferOfProductsServices").ITransferRequest} transferOfProductRequest
   */
  async toCreate(transferOfProductRequest) {
    if (
      transferOfProductRequest.originId <= 0 ||
      transferOfProductRequest.destinyId <= 0
    ) {
      throw {
        status: 409,
        error: {
          message: 'Source and destination configuration not allowed'
        }
      }
    }

    if (
      transferOfProductRequest.originId === 1 &&
      transferOfProductRequest.destinyId <= 1
    ) {
      throw {
        status: 409,
        error: {
          message: 'Source and destination configuration not allowed'
        }
      }
    }

    if (
      transferOfProductRequest.destinyId === 1
      && transferOfProductRequest.originId <= 1
    ) {
      throw {
        status: 409,
        error: {
          message: 'Source and destination configuration not allowed'
        }
      }
    }

    if (
      transferOfProductRequest.originId > 1 &&
      transferOfProductRequest.destinyId > 1
    ) {
      throw {
        status: 409,
        error: {
          message: 'Source and destination configuration not allowed'
        }
      }
    }
  }
}

module.exports = new TransferOfProductRules()