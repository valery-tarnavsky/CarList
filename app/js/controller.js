class Controller extends Observer{
    constructor(model, view){
        super();
        this.model = model;
        this.view = view;

        this.view.subscribeEvent("add", this.addCar.bind(this));
        this.view.subscribeEvent("remove", this.removeCar.bind(this));
        this.view.subscribeEvent("removeItems", this.removeCars.bind(this));

        this.view.subscribeEvent("edit", this.editCar.bind(this));
        this.view.subscribeEvent("update", this.updateCar.bind(this));

        this.model.subscribeEvent("empty", this.showTable.bind(this));
        this.model.subscribeEvent("addItems", this.addCars.bind(this));

        this.editedId = null;
    }

    addCar(car){
        var car = {
            id: Date.now(),
            vendor: car.vendor,
            model: car.model,
            year: car.year,
            color: car.color,
        };
        this.model.addItem(car);
        this.view.addItem(car);
    }

    addCars(cars){
        this.view.addItems(cars);
    }

    removeCar(id){
        this.model.removeItem(id);
        this.view.removeItem(id);
    }

    removeCars(arr){
        this.model.removeItems(arr);
        this.view.removeItems(arr);
    }

    editCar(id){
        var item = this.model.getItemById(id);
        this.editedId = this.view.handleEdit(item);
    }

    updateCar(item){
        item.id  = this.editedId;
        this.view.updateItem(item);
        this.model.updateItem(item);
    }

    showTable(status){
        this.view.showTable(status);
    }

    getData(){
        this.model.getData("https://gist.githubusercontent.com/valery-tarnavsky/8aa4ea6b0fba1e28932cb92ac8b65324/raw/848e615ffdb8747eeea2bd21a2cd9e81cbe29234/carsData");
    }

    init(){
        this.getData();
        this.view.initListeners();
    }


}