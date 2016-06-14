const newUUID = function () {
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
        var data = {};

        try {
            data = JSON.parse(localStorage[this.name])
        } catch (e) {
        }

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
        var rawCollection = rawCollections[name] || {};

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
        array._subCollection = false;
        array.__proto__.insert = this.insert;
        array.__proto__.find = this.find;
        array.__proto__._findById = this._findById;
        array.__proto__._findByObject = this._findByObject;

        return array;
    }

    insert(doc) {
        doc._id = newUUID();
        this.push(doc);
        this._database.updateCollection(this);
        return doc._id;
    }

    find(filter) {
        if (typeof filter == 'object') {
            return this._findByObject(filter);
        } else {
            return this._findById(filter);
        }
    }

    _findById(id) {
        var subCollection = new Collection();
        subCollection._subCollection = true;

        for (var itemKey = 0; itemKey < this.length; itemKey++) {
            if (this[itemKey]._id == id) {
                subCollection.push(this[itemKey]);
                break;
            }
        }

        return subCollection;
    }

    _findByObject(objectFilter) {
        var subCollection = new Collection();
        subCollection._subCollection = true;

        for (var itemKey = 0; itemKey < this.length; itemKey++) {
            var insert = true;
            for (var filterKey in objectFilter) {
                if (typeof objectFilter[filterKey] == 'object') {
                    if (!this._handleExpression(this[itemKey][filterKey], objectFilter[filterKey], this, objectFilter, itemKey, filterKey)) {
                        insert = false;
                    }
                }

                if (this[itemKey][filterKey] != objectFilter[filterKey]) {
                    insert = false;
                }
            }

            if (insert) {
                subCollection.push(this[itemKey]);
            }
        }

        return subCollection;
    }

    _handleExpression(value, check, collection, filter, key, expression) {

    }

}


export default DB;

export {
    Collection
};
