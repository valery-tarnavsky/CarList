class View extends Observer{
    constructor(){
        super();
        this.modalWrap = document.querySelector('.modalWrap');
        this.modalFooter = document.querySelector('.modalFooter');
        this.modalTitle = document.querySelector('.modalTitle');
        this.carForm = document.querySelector('.carForm');
        this.vendor = document.querySelector('#vendor');
        this.model = document.querySelector('#model');
        this.year = document.querySelector('#year');
        this.color = document.querySelector('#color');
        this.formButton = document.querySelector('.formButton');

        this.tableWrap = document.querySelector('.tableWrap');
        this.tooltip = document.querySelector('.checkedTooltip');
        this.tooltipCount = document.querySelector('.checkedCount');
        this.removeAll = document.querySelector('.removeAll');
        this.table = document.querySelector('.carListTable');
        this.list = document.querySelector('.carListTable tbody');
        this.row = document.getElementsByTagName('TR');
        this.rowIndex = document.getElementsByClassName('index');
        this.addButton = document.querySelector('#add');

        this.notify = new Notify();

        this.config = {
            addModal : {
                title  : '<h3>Add new car</h3>',
                button : '<button type="button" data-event="add" class="btn btn-dark btn-search btn-sm">Save</button>'
            },
            editModal: {
                title  : '<h3>Edit car info</h3>',
                button : '<button type="button" data-event="update" class="btn btn-dark btn-search btn-sm">Save changes</button>'
            }
        };
        this.checkedItems = [];

    }

    showTable(status){
        this.table.classList.toggle("hidden", status);
    }

    setModalFeatures(name){
        this.modalTitle.innerHTML = this.config[name].title;
        this.modalFooter.innerHTML = this.config[name].button;
    }

    showModal(name, status){
        this.modalWrap.classList.toggle("hidden", !status);
        status && this.setModalFeatures(name);
        this.tableWrap.classList.toggle("hidden", status);
    }
    /*modal*/

    handleTooltipClick(){
        this.callEvent('removeItems', this.checkedItems);
        this.showTooltip(false);
        this.removeAllChecked();
    }

    showTooltip(status){
        this.tooltip.classList.toggle("hidden", !status);
    }

    saveChecked(id){
        this.checkedItems.push(id);
    }

    removeChecked(id){
        this.checkedItems.splice(this.checkedItems.indexOf(id), 1);
    }

    removeAllChecked(){
        this.checkedItems.length = 0;
    }

    disableButtons(type){
        this.checkedItems.forEach(function (id) {
            var item = this.findListItemById(id);
            var buttons = [...item.getElementsByTagName("button")];
            buttons.forEach(function (button) {
                type ? button.setAttribute('disabled', true) : button.removeAttribute('disabled')
            })
        }.bind(this));
    }

    enableButtonsById(id){
        var item = this.findListItemById(id);
        var buttons = [...item.getElementsByTagName("button")];
        buttons.forEach(function (button) {
            button.removeAttribute('disabled')
        })
    }

    initTooltip(item){
        this.showTooltip(true);
        this.tooltip.style.top = `${item.offset-45}px`;
        this.tooltipCount.innerText = this.checkedItems.length;
    }

    handleChecking(item){
        this.initTooltip(item);
        item.target.checked && this.checkedItems.length > 1 ? this.disableButtons(true) : this.enableButtonsById(item.id);
        if(this.checkedItems.length < 2) {
            this.showTooltip(false);
            this.disableButtons(false);
        }
    }

    getChecked(item) {
        item.target.checked ? this.saveChecked(item.id) : this.removeChecked(item.id);
        this.handleChecking(item);
    }
    /* Tooltip */

    createElement(item){
        var count = this.row.length;
        return  `<tr class="fade-in" data-id="${item.id}">
                    <th scope="row"><input type="checkbox" id=""></th>
                    <td class="index">${count}</td>
                    <td>${item.vendor}</td>
                    <td>${item.model}</td>
                    <td>${item.year}</td>
                    <td>${item.color}</td>
                    <td><button type="button" data-event="edit" class="btn btn-warning btn-sm">Edit</button></td>
                    <td><button type="button" data-event="remove" class="btn btn-light btn-sm">Delete</button></td>
                </tr>`;
    }

    getFormData(){
        return {
            vendor : this.vendor.value,
            model  : this.model.value,
            year   : this.year.value,
            color  : this.color[this.color.selectedIndex].text
        };
    }

    setFormData(item){
        this.vendor.value = item.vendor;
        this.model.value = item.model;
        this.year.value = item.year;
        this.color.value = item.color;
    }

    /* Get / Set*/

    findListItemById(id){
        return this.list.querySelector(`[data-id="${id}"]`);
    }

    recalcRowNum(){
        var ccunter = 1;
        var rowIndexes = [...this.rowIndex];
        rowIndexes.forEach(function(index){
            index.innerHTML = ccunter++;
        })
    }

    isValid(item){
        this.validate = new Validate(item);
        return this.validate.isNotEmpty() && this.validate.isYearValid();
    }

    /* auxiliary */

    addItem(item){
        let listItem = this.createElement(item);
        this.list.insertAdjacentHTML('beforeend', listItem);
        this.notify.create("New item successfully added", "alert-success");
    }

    addItems(items){
        items.forEach(function(item){
            let listItem = this.createElement(item);
            this.list.insertAdjacentHTML('beforeend', listItem);
        }.bind(this));
    }

    updateItem(item){
        var itemToReplace = this.findListItemById(item.id);
        var prevItem = itemToReplace.previousElementSibling;
        var updatedItem = this.createElement(item);
        itemToReplace.remove();
        prevItem ? prevItem.insertAdjacentHTML(`afterEnd`, updatedItem) :  this.list.insertAdjacentHTML('afterBegin', updatedItem);
        this.recalcRowNum();
        this.notify.create("Item successfully updated", "alert-success");
    }

    removeItem(id){
        let listItem = this.findListItemById(id);
        this.list.removeChild(listItem);
        this.recalcRowNum();
        this.notify.create("Item successfully removed", "alert-success");
    }

    removeItems(idList){
        idList.forEach(function(id){
            this.list.removeChild(this.findListItemById(id));
        }.bind(this));
        this.recalcRowNum();
        this.notify.create(`${idList.length} items successfully removed`, "alert-success")
    }
    /* crud */

    handleEdit(item){
        this.showModal('editModal', true);
        this.setFormData(item);
        return item.id;
    }

    handleTableClick(e){
        var target = e.target;
        if(!target.type){return}
        var id = target.closest("TR").getAttribute("data-id");
        var eventName = target.getAttribute("data-event"); /* edit or remove */
        target.type === "button" ? this.callEvent(eventName, id) : this.getChecked({target:target, id:id, offset: e.clientY})
    }

    handleModalClick(e){
        var target = e.target;
        if(target.tagName !== "BUTTON"){return}
        var eventName = target.getAttribute("data-event");/* save or update */
        var item = this.getFormData();
        if(this.isValid(item)){
            this.callEvent(eventName, item);
            this.carForm.reset();
            this.showModal(false);
        }
    }
    /* Handlers */

    initListeners() {
        this.addButton.addEventListener('click', function(){this.showModal('addModal', true)}.bind(this));
        this.removeAll && this.removeAll.addEventListener('click', this.handleTooltipClick.bind(this));
        this.list && this.list.addEventListener('click', this.handleTableClick.bind(this));
        this.modalWrap.addEventListener('click', this.handleModalClick.bind(this));
    }

}