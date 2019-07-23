"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Gaql - a simple tool for Google Ads Query Language
 * @see https://developers.google.com/google-ads/api/docs/query/grammar
 */
var Gaql =
/*#__PURE__*/
function () {
  /**
   * Create a new Gaql.
   *
   * @public
   * @constructor
   */
  function Gaql() {
    _classCallCheck(this, Gaql);

    this.result = '';
    this.selectFields = [];
    this.resource = null;
    this.conditions = [];
    this.ordering = null;
    this.limitNum = null;
    this.clauses = [];
    return this;
  }
  /**
   * Get operators.
   *
   * @public
   * @enum
   */


  _createClass(Gaql, [{
    key: "select",

    /**
     * Set fields.
     *
     * @public
     * @method
     * @param {Array || String} fields
     * @returns Gaql
     */
    value: function select(fields) {
      if (Array.isArray(fields)) this.selectFields = fields;else if (typeof fields === 'string') this.selectFields = [fields];else throw new Error('arg is invalid, it should be an array or a string.');
      return this;
    }
    /**
     * Set what resource this query is from.
     *
     * @public
     * @method
     * @param {Array || String} resource
     * @returns Gaql
     */

  }, {
    key: "from",
    value: function from(resource) {
      if (typeof resource === 'string') this.resource = resource;else throw Error('arg is invalid, it should be a string.');
      return this;
    }
    /**
     * Set where condition when having only one condition.
     *
     * @public
     * @method
     * @param {Array || String} conditions
     * @returns Gaql
     */

  }, {
    key: "where",
    value: function where(conditions) {
      if (Array.isArray(conditions)) this.conditions = conditions;else if (typeof conditions === 'string') this.conditions = [conditions];else throw new Error('arg is invalid, it should be an array or a string.');
      return this;
    }
    /**
     * Add where conditions.
     *
     * @public
     * @method
     * @param {Array || String} conditions
     * @returns Gaql
     */

  }, {
    key: "addWhere",
    value: function addWhere(field, operator, value) {
      var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'AND';
      if (!(typeof field === 'string')) throw new Error('field is invalid, it should be a string.');
      if (!(typeof operator === 'string') || !this.operators.includes(operator)) return new Error('field is invalid, it should be a string.');
      if (!(typeof value === 'string')) throw new Error('value is invalid, it should be a string.');

      if (operator === 'DURING') {
        if (!this.durings.includes(value)) throw new Error('value is invalid, it should be included in during options.');
      }

      if (this.conditions.length) this.conditions = [].concat(_toConsumableArray(this.conditions), ["".concat(mode, " ").concat(field, " ").concat(operator, " ").concat(value)]);else this.conditions = [].concat(_toConsumableArray(this.conditions), ["".concat(field, " ").concat(operator, " ").concat(value)]);
      return this;
    }
    /**
     * Set order by.
     *
     * @public
     * @method
     * @param {String} ordering
     * @returns Gaql
     */

  }, {
    key: "orderBy",
    value: function orderBy(ordering) {
      if (typeof ordering === 'string' && this.orderings.includes(ordering)) this.ordering = ordering;else throw new Error('arg is invalid, it should be a string and one of "ASC" and "DESC".');
      return this;
    }
    /**
     * Set limit.
     *
     * @public
     * @method
     * @param {number} limit
     * @returns Gaql
     */

  }, {
    key: "limit",
    value: function limit(_limit) {
      if (Number.isInteger(_limit)) this.limitNum = _limit;else throw new Error('arg is invalid, it should be an integer.');
      return this;
    }
    /**
     * Compile the currenct parameters to result.
     *
     * @private
     * @method
     * @returns Gaql
     */

  }, {
    key: "_compile",
    value: function _compile() {
      if (this.selectFields && this.selectFields.length) {
        this.result = "SELECT \n ".concat(this.selectFields.join(', \n '), " \n");
      }

      if (this.resource) {
        this.result = this.result + "FROM \n ".concat(this.resource, " \n");
      }

      if (this.conditions && this.conditions.length) {
        this.result = this.result + "WHERE \n ".concat(this.conditions.join('\n '), " \n");
      }

      if (this.ordering) {
        this.result = this.result + "ORDER BY \n ".concat(this.ordering, " \n");
      }

      if (this.limitNum) {
        this.result = this.result + "LIMIT \n ".concat(this.limitNum, " \n");
      }

      if (this.clauses && this.clauses.length) {
        this.result = this.result + "PARAMETERS \n ".concat(this.clauses.join('\n '), " \n");
      }

      return this;
    }
    /**
     * Set parameter clauses.
     *
     * @public
     * @method
     * @param {Array || String} clauses
     * @returns Gaql
     */

  }, {
    key: "parameters",
    value: function parameters(clauses) {
      if (Array.isArray(clauses)) this.clauses = clauses;else if (typeof clauses === 'string') this.clauses = [clauses];else throw new Error('arg is invalid, it should be an array or a string.');
      return this;
    }
    /**
     * Get Result.
     *
     * @public
     * @method
     * @returns {String} result
     */

  }, {
    key: "toString",
    value: function toString() {
      this._compile();

      return this.result;
    }
  }, {
    key: "operators",
    get: function get() {
      return ['=', '!=', '<', '<=', '>=', '>', 'IN', 'NOT IN', 'LIKE', 'NOT LIKE', 'CONTAINS ANY', 'CONTAINS ALL', 'CONTAINS NONE', 'IS NULL', 'IS NOT NULL', 'DURING', 'BETWEEN'];
    }
    /**
     * Get orderings.
     *
     * @public
     * @enum
     */

  }, {
    key: "orderings",
    get: function get() {
      return ['ASC', 'DESC'];
    }
    /**
     * Get durings.
     *
     * @public
     * @enum
     */

  }, {
    key: "durings",
    get: function get() {
      return ['LAST_14_DAYS', 'LAST_30_DAYS', 'LAST_7_DAYS', 'LAST_BUSINESS_WEEK', 'LAST_MONTH', 'LAST_WEEK_MON_SUN', 'LAST_WEEK_SUN_SAT', 'THIS_MONTH', 'THIS_WEEK_MON_TODAY', 'THIS_WEEK_SUN_TODAY', 'TODAY', 'YESTERDAY'];
    }
  }]);

  return Gaql;
}();

exports["default"] = Gaql;