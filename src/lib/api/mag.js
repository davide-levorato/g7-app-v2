const printUdc = '/mag/printUdc'
const idLabel = '/mag/idLabel'

const udcSetItem = '/mag/udc/item'
const udcDelItem = '/mag/udc/item/del'
const udcSetLocation = '/mag/udc/location'

const inboundDocComplete = '/mag/aqtddt/complete'

const lpSetItem = '/mag/lp/item'
const magMov = '/mag/mov'
const magProd = '/mag/prod'

export {
  printUdc as apiPrintUdc,
  idLabel as apiIdLabel,
  udcSetItem as apiUdcSetItem,
  udcDelItem as apiUdcDelItem,
  udcSetLocation as apiUdcSetLocation,
  inboundDocComplete as apiInboundDocComplete,

  lpSetItem as apiLpSetItem,

  magMov as apiMagMov,
  magProd as apiMagProd
}
