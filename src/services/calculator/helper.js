import { Form } from './form.js'

export class Helper {
    constructor(pricing, form) {
        this.pricing = pricing
        this.form = new Form(form)
    }

    getProjectTypeLongName() {
        // returns full text name of project
        const found = this.pricing.type.find((element) => element.value === this.form.initProjectType())
        if (found) {
            return found.text
        }
        return ''
    }

    getAcademicLevelLongName() {
        // returns full text name of level
        const found = this.pricing.level.find((element) => element.value === this.form.initAcademicLevel())
        if (found) {
            return found.text;
        }
        return ''
    }
}
