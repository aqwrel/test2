import { Helper } from './helper.js'
import { Form } from './form.js'
import { Message } from './message.js'
import { Deadline } from './deadline.js'

export class CalculatorValidator {
    constructor(pricing, form) {
        this.formData = form
        this.pricing = pricing
        this.helper = new Helper(pricing, form)
        this.form = new Form(form)
        this.message = new Message(pricing, form)
        this.deadline = new Deadline(pricing, form)
    }

    getServicesAmount() {
        // pages, chats, slides, problems
        return this.pages.calculate() + this.miscellaneous.calculate()
    }

    getData() {
        let dataset = {}
        if (this.validate() === true) { // dataset is available
            dataset = this.buildData()
        } else { // not available
            dataset = {
                description: {
                    message: this.message.getQuoteMessage(),
                    minHours: this.deadline.getEstimateHours()
                }
            }
        }
        return dataset
    }

    validate() {
        return this.message.isPriceAvailable()
    }

    buildData() {
        const dataset = {
            description: {
                message: this.message.getQuoteMessage(),
                deadline: this.deadline.getTimeframeMessage(),
                timeframe: this.deadline.calculate(),
                project: this.helper.getProjectTypeLongName(),
                level: this.helper.getAcademicLevelLongName()
            }
        }

        return dataset
    }
}
