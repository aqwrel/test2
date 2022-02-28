import { Form } from './form.js'
import { Deadline } from './deadline.js'

export class Message {
    constructor(pricing, form) {
        this.pricing = pricing
        this.form = new Form(form)
        this.deadline = new Deadline(pricing, form)
    }

    isPriceAvailable() {
        // if one of required is empty
        if (!this.form.initProjectType()) return false
        if (!this.form.initAcademicLevel()) return false
        if (!this.form.initDuedate()) return false
        if (!this.deadline.isTimeframeAllowedMinimum()) return false
        if (!this.deadline.isTimeframeAllowedForProject()) return false
        return true
    }

    isDefaultState() {
        // if all required are empty
        return (!this.form.initProjectType()
            && !this.form.initAcademicLevel()
            && !this.form.initDuedate()
        )
    }

    getQuoteMessage() {
        // default state (nothing selected)
        if (this.isDefaultState()) {
            return 'Start filling out the form to get a quote'
        }
        if (!this.form.initProjectType()) {
            return 'Set the type of project'
        }
        if (!this.form.initAcademicLevel()) {
            return 'Set the level'
        }
        if (!this.form.initDuedate()) {
            return 'Set the date'
        }
        if (!this.deadline.isTimeframeAllowedMinimum()) {
            return 'Deadline is less than minimum timeframe'
        }
        if (!this.deadline.isTimeframeAllowedForProject()) {
            return `~ ${this.deadline.getEstimateHours()} hours is needed to complete your project. Your deadline is ${this.deadline.turnaroundHumanize('hours')}`
        }
        return ''
    }
}
