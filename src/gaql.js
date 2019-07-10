/**
 * Gaql - a simple tool for Google Ads Query Language
 * @see https://developers.google.com/google-ads/api/docs/query/grammar
 */

export default class Gaql {

  /**
   * Create a new Gaql.
   *
   * @public
   * @constructor
   */
  constructor () {
    this.result = ''
    this.selectFields = []
    this.resource = null
    this.conditions = []
    this.ordering = null
    this.limitNum = null
    this.clauses = []
    return this
  }

  /**
   * Get operators.
   *
   * @public
   * @enum
   */
  get operators () {
    return [
      '=', '!=', '<', '<=', '>=', '>',
      'IN', 'NOT IN', 'LIKE', 'NOT LIKE',
      'CONTAINS ANY', 'CONTAINS ALL', 'CONTAINS NONE',
      'IS NULL', 'IS NOT NULL', 'DURING', 'BETWEEN'
    ]
  }

  /**
   * Get orderings.
   *
   * @public
   * @enum
   */
  get orderings () {
    return ['ASC', 'DESC']
  }

  /**
   * Get durings.
   *
   * @public
   * @enum
   */
  get durings () {
    return [
      'LAST_14_DAYS', 'LAST_30_DAYS', 'LAST_7_DAYS',
      'LAST_BUSINESS_WEEK', 'LAST_MONTH', 'LAST_WEEK_MON_SUN',
      'LAST_WEEK_SUN_SAT', 'THIS_MONTH', 'THIS_WEEK_MON_TODAY',
      'THIS_WEEK_SUN_TODAY', 'TODAY', 'YESTERDAY'
    ]
  }

  /**
   * Set fields.
   *
   * @public
   * @method
   * @param {Array || String} fields
   * @returns Gaql
   */
  select (fields) {
    if (Array.isArray(fields)) this.selectFields = fields
    else if (typeof fields === 'string') this.selectFields = [fields]
    else throw new Error('arg is invalid, it should be an array or a string.')

    return this
  }

  /**
   * Set what resource this query is from.
   *
   * @public
   * @method
   * @param {Array || String} resource
   * @returns Gaql
   */
  from (resource) {
    if (typeof resource === 'string') this.resource = resource
    else throw Error('arg is invalid, it should be a string.')

    return this
  }

  /**
   * Set where condition when having only one condition.
   *
   * @public
   * @method
   * @param {Array || String} conditions
   * @returns Gaql
   */
  where (conditions) {
    if (Array.isArray(conditions)) this.conditions = conditions
    else if (typeof conditions === 'string') this.conditions = [conditions]
    else throw new Error('arg is invalid, it should be an array or a string.')

    return this
  }

  /**
   * Add where conditions.
   *
   * @public
   * @method
   * @param {Array || String} conditions
   * @returns Gaql
   */
  addWhere (field, operator, value, mode = 'AND') {
    if (!(typeof field === 'string')) throw new Error('field is invalid, it should be a string.')
    if (!(typeof operator === 'string') || !this.operators.includes(operator)) return new Error('field is invalid, it should be a string.')
    if (!(typeof value === 'string')) throw new Error('value is invalid, it should be a string.')
    if (operator === 'DURING') {
      if (!this.durings.includes(value)) throw new Error('value is invalid, it should be included in during options.')
    }

    if (this.conditions.length) this.conditions = [...this.conditions, `${mode} ${field} ${operator} ${value}`]
    else this.conditions = [...this.conditions, `${field} ${operator} ${value}`]

    return this
  }

  /**
   * Set order by.
   *
   * @public
   * @method
   * @param {String} ordering
   * @returns Gaql
   */
  orderBy (ordering) {
    if (typeof ordering === 'string' && this.orderings.includes(ordering)) this.ordering = ordering
    else throw new Error('arg is invalid, it should be a string and one of "ASC" and "DESC".')

    return this
  }

  /**
   * Set limit.
   *
   * @public
   * @method
   * @param {number} limit
   * @returns Gaql
   */
  limit (limit) {
    if (Number.isInteger(limit)) this.limitNum = limit
    else throw new Error('arg is invalid, it should be an integer.')

    return this
  }

  /**
   * Compile the currenct parameters to result.
   *
   * @private
   * @method
   * @returns Gaql
   */
  _compile () {
    if (this.selectFields && this.selectFields.length) {
      this.result = `SELECT \n ${this.selectFields.join(', \n ')} \n`
    }

    if (this.resource) {
      this.result = this.result + `FROM \n ${this.resource} \n`
    }

    if (this.conditions && this.conditions.length) {
      this.result = this.result + `WHERE \n ${this.conditions.join('\n ')} \n`
    }

    if (this.ordering) {
      this.result = this.result + `ORDER BY \n ${this.ordering} \n`
    }

    if (this.limitNum) {
      this.result = this.result + `LIMIT \n ${this.limitNum} \n`
    }

    if (this.clauses && this.clauses.length) {
      this.result = this.result + `PARAMETERS \n ${this.clauses.join('\n ')} \n`
    }

    return this
  }

  /**
   * Set parameter clauses.
   *
   * @public
   * @method
   * @param {Array || String} clauses
   * @returns Gaql
   */
  parameters (clauses) {
    if (Array.isArray(clauses)) this.clauses = clauses
    else if (typeof clauses === 'string') this.clauses = [clauses]
    else throw new Error('arg is invalid, it should be an array or a string.')

    return this
  }

  /**
   * Get Result.
   *
   * @public
   * @method
   * @returns {String} result
   */
  toString () {
    this._compile()

    return this.result
  }
}
