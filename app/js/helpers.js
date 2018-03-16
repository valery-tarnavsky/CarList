class Observer {
    constructor() {
        this.events = {};
    }
    subscribeEvent(name, func) {
        this.events[name] = func;
    }
    callEvent(name, arg) {
        if (this.events[name]) {
            this.events[name](arg);
        }
    }
}

class Notify {
    constructor(){
        this.notifyWrapper = document.querySelector('.notify');
    }
    insertToBaseTmp(msg, name){
        return `<div class="${name} notifyMsg text-center fade-in"><span>${msg}</span></div>`;
    }

    render (item, name){
        let target = document.querySelector(`.${name}`);
        target ? target.innerHTML = item : this.notifyWrapper.insertAdjacentHTML("afterbegin", item);
    }

    remove(name){
        let target = document.querySelector(`.${name}`);
        target && target.remove();
    }

    create(msg, name, type){
        var item = this.insertToBaseTmp(msg, name);
        this.render(item, name);
        type || setTimeout(function(){this.remove(name)}.bind(this), 2000);
    }
}

class Validate {
    constructor(data){
        this.data = data;
        this.notify = new Notify();
        this.isNumeric = new RegExp('^[0-9]*$');
    }
    isNotEmpty() {
        let result = !(this.data.vendor === "" || this.data.model === "" || this.data.year === "");
        result || this.notify.create("All fields are required", "alert-danger");
        return result
    }

    isYearValid() {
        let result = this.isNumeric.test(this.data.year) && this.data.year.length == 4;
        result || this.notify.create("Invalid year value", "alert-danger");
        return result;
    }
}