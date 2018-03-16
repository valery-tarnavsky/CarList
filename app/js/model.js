class Model extends Observer{
    constructor(){
        super();
        this.data = [];
    }

    watch(){
        this.callEvent("empty", this.data.length === 0);
    }

    getItemById(id){
        return this.data.find(item => item.id == id)
    }

    addItem(item){
       this.data.push(item);
       this.watch();
    }

    removeItem(id){
        let index = this.data.findIndex(item => item.id == id);
        this.data.splice(index, 1);
        this.watch();
    }

    removeItems(idList){
        var tmpData = this.data.slice();
        tmpData.forEach(function(dataItem){
            idList.forEach(function(id){
                if(dataItem.id == id){
                    this.removeItem(dataItem.id);
                }
            }.bind(this));
        }.bind(this));
    }

    updateItem(item){
        let itemToUpdate = this.getItemById(item.id);
        for(let key in item) {
            itemToUpdate[key] = item[key];
        }
    }

    getData(url){
        return fetch (url).then(function(response) {
            return response.json();
        })
        .then(function(data){
            if(data){
                this.data = data.slice();
                this.callEvent("addItems", this.data);
            }
        }.bind(this))

    }
}