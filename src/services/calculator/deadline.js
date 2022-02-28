/* eslint-disable class-methods-use-this */
import dayjs from 'dayjs'
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

import { Form } from './form.js'

export class Deadline {
    constructor(pricing, form) {
        this.pricing = pricing
        this.form = new Form(form)
        this.minimumAllowedTimeframe = 3
    }

    calculate() {
        let timeframe = null
        try {
            timeframe = this.getDueHours()
        } catch (error) {
            console.error(error)
        }
        if (timeframe == null) throw new Error('timeframe is null')
        return timeframe
    }

    getEstimateHours() {
        return this.getRateHours() * this.form.initPages()
    }

    getRateHours() {
        // this is an estimated time to complete 1 page for a given project type
        const found = this.pricing.type.find((element) => element.value === this.form.initProjectType())
        console.log(found);
        if (found) {
            return found.hours
        }
        return ''
    }

    getDueHours() {
        const due = dayjs(this.form.initDuedate())
        const now = dayjs()
        let hours = dayjs.duration(due.diff(now))
        hours = hours.asHours()
        return hours
    }

    // Актуализация дедлайна для Unpaid ордера
    getRefreshedDeadline() {
        const estimateTime = this.getDueHours() >= this.getEstimateHours() ? this.getDueHours() : this.minimumAllowedTimeframe + 0.5
        const now = dayjs().add(estimateTime < 3 ? 3.5 : estimateTime, 'hours')
        return now.toISOString()
    }

    isTimeframeAllowedMinimum() {
        return this.getDueHours() >= this.minimumAllowedTimeframe
    }

    isTimeframeAllowedForProject() {
        if (this.getDueHours() > this.getEstimateHours()) {
            return true
        } return false
    }

    turnaroundHumanize(mode) {
        // !!!! --- dayjs accepts string in quotes --- !!!!
        const due = dayjs(`${this.form.initDuedate()}`)
        const now = dayjs();
        if (now > due) return false;
        if (mode === 'hours') {
            return `in ${dayjs.duration(due.diff(now)).humanize()}`;
        }
        if (mode === 'date') {
            return due.format('dddd');
        }
        return `in ${dayjs.duration(due.diff(now)).humanize()}|${due.format('dddd, MMMM Do YYYY, h:mm:ss a')}`;
    }

    getTimeframeMessage() {
        const due = dayjs(this.form.initDuedate())
        const now = dayjs()
        return `in ${dayjs.duration(due.diff(now)).humanize()}`
    }
}
