import { fineAddress } from '../scripts/constants'
import Converter from '../scripts/converter'
import Countdown from '../scripts/countdown'

export default {
    // eslint-disable-next-line no-unused-vars
    install: (app, options) => {
        app.config.globalProperties.$fineAddress = (addr) => {
            return fineAddress(addr)
        },
            app.config.globalProperties.$toMoney = (value, max) => {
                return Converter.toMoney(value, max);
            },
            app.config.globalProperties.$nFormat = (value, digits = 2) => {
                return Converter.nFormatter(value, digits)
            },
            app.config.globalProperties.$fromWei = (value) => {
                return Converter.fromWei(value)
            },
            app.config.globalProperties.$toWei = (value) => {
                return Converter.toWei(value)
            },
            app.config.globalProperties.$toDate = (value) => {
                return Countdown.toDate(value)
            }
    }
}