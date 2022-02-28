export class Form {
    constructor(form) {
        this.form = form
    }

    initProjectType() {
        return this.form.type
    }

    initAcademicLevel() {
        return this.form.academiclevel
    }

    initDuedate() {
        return this.form.datetime
    }

    initPages() {
        return Number(this.form.pages)
    }
}
