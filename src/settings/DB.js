const newUUID = ()=> {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

class DB {
    constructor(name) {
        this.name = name;
        this.collections = {};
        this.data = this.loadData();
    }

    loadData() {
        var data = JSON.parse(localStorage[this.name]);

        if (data.collections) {
            return data;
        } else {
            return {
                collections: {}
            };
        }
    }

    saveData() {
        localStorage[this.name] = JSON.stringify(this.data);
    }

    updateCollection(collection) {
        if (!this.data.collections) {
            this.data.collections = {};
        }

        this.data.collections[collection._name] = {
            data: collection
        };

        this.saveData();
    }

    addCollection(name, options) {
        this.collections[name] = options || {};

        var rawCollections = this.data.collections || {};
        var rawCollection = rawCollections[name];

        var rawData = rawCollection.data || [];

        var collection = new Collection();
        collection._database = this;
        collection._name = name;

        rawData.forEach((item)=> {
            if (this.collections[name].transform) {
                collection.push(this.collections[name].transform(item));
            } else {
                collection.push(item);
            }
        });

        return collection;
    }
}

// TODO Add support for partial collections, where only contained items wil be updated.
class Collection {
    constructor(items) {
        var array = [];

        if (typeof items == 'array') {
            items.forEach((item)=> {
                array.push(item);
            });
        } else if (items != undefined) {
            array.push(items);
        }

        array._database = {};
        array._name = '';
        array.__proto__.insert = this.insert;

        return array;
    }

    insert(doc) {
        doc._id = newUUID();
        this.push(doc);
        this._database.updateCollection(this);
        return doc._id;
    }
}


export default DB;

export {
    Collection
};

