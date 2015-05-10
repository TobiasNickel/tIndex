tIndex = (function(undefined) {
    var id = 1;
	/**
	 *@contructor
	 *@param indexes {Array of Strings} 
	 *			containing the names for the indexes that get created
	 *@param tIdName {optional String} 
	 *			property name that will be added to the object
	 */
    function tIndex(indexes, tIdName) {
        this.tIdName = tIdName || '_tId'
        this._indexes = {};
        this.keys = {}
        for (var i = 0; i < indexes.length; i++) {
            this._indexes[indexes[i]] = {};
        }
    }
    tIndex.prototype = { 
		/**
		 * finds objects, that belong to a given key in an index
		 * @param index {string} the given intex
		 * @param key   {string} the given key
		 */
        get : function get(index, key) {
            if (this._indexes[index] && this._indexes[index][key])
                return this._indexes[index][key].slice() || [];
        },
		
		/**
		 *	removes the given object from the index
		 *	@param object {Object} the given object
		 */
        remove : function remove(object) {
            if (object[this.tIdName] === undefined)
                return;
            var keys = this.keys[object[this.tIdName]]
            for (name in this._indexes) {
                //remove
                var index = this._indexes[name]
                index[keys[name]] = [];
                index[keys[name]].splice(index[keys[name]].indexOf(object), 1);
            }
            this.keys[object[this.tIdName]] = undefined;
            object[this.tIdName] = undefined;
        },
		
		/**
		 *	used to insert a given object
		 *	@param object {Object} the given object
		 */
        add : function add(object, pId) {
            if (object[this.tIdName] !== undefined)
                return;
            object[this.tIdName] = pId || id++;
            var keys = {};
            for (name in this._indexes) {
                var index = this._indexes[name]
                if (!index[object[name]])
                    index[object[name]] = [];
                index[object[name]].push(object);
                keys[name] = object[name];
            }
            this.keys[object[this.tIdName]] = keys;
        },
		
		/**
		 *	updates the index for the given objects, not the object
		 *	@param object {Object} the given object
		 */
        update: function update(object) {
			var id=object[this.tIdName];
            this.remove(object);
            this.add(object, id);
        }
    }
    return tIndex;
})();
