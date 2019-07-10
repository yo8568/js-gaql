/* eslint-disable import/no-duplicates */
/* eslint-disable no-undef */

import gaql from '../src/gaql'

describe('GAQL', () => {
  describe('initial', () => {
    test('it should return initial values', () => {
      expect(new gaql()).toEqual({
        limitNum: null,
        ordering: null,
        resource: null,
        result: '',
        selectFields: [],
        conditions: [],
        clauses: []
      })

      expect(new gaql().operators).toHaveLength(17)
      expect(new gaql().orderings).toHaveLength(2)
      expect(new gaql().durings).toHaveLength(12)
    })
  })

  describe('#select()', () => {
    test('it should set array value in selectFields', () => {
      const result = new gaql().select(['ad_group.id'])

      expect(result.selectFields).toEqual(['ad_group.id'])
    })

    test('it should set string value in selectFields', () => {
      const result = new gaql().select('ad_group.id')

      expect(result.selectFields).toEqual(['ad_group.id'])
    })

    test('it should return error when input is number', () => {
      expect(() => new gaql().select(2)).toThrowError()
    })
  })

  describe('#from()', () => {
    test('it should set string value in resource', () => {
      const result = new gaql().from('ad_group')

      expect(result.resource).toEqual('ad_group')
    })

    test('it should return error when input is not string', () => {
      expect(() => new gaql().from(2)).toThrowError()
    })
  })

  describe('#where()', () => {
    test('it should set string value in conditions', () => {
      const result = new gaql().where(['ad_group_criterion.type = KEYWORD', 'ad_group_criterion.type = TEST'])

      expect(result.conditions).toEqual(['ad_group_criterion.type = KEYWORD', 'ad_group_criterion.type = TEST'])
    })
  
    test('it should set string value in conditions', () => {
      const result = new gaql().where('ad_group_criterion.type = KEYWORD')

      expect(result.conditions).toEqual(['ad_group_criterion.type = KEYWORD'])
    })

    test('it should return error when input is not string', () => {
      expect(() => new gaql().where(2)).toThrowError()
    })
  })

  describe('#addWhere()', () => {
    test('it should set string value in conditions', () => {
      const field = 'metrics.clicks'
      const operator = '>'
      const value = '135'
      const result = new gaql().addWhere(field, operator, value)

      expect(result.conditions).toEqual(['metrics.clicks > 135'])
    })

    test('it should set string value in conditions when operator is "DURING"', () => {
      const field = 'date'
      const operator = 'DURING'
      const value = 'LAST_14_DAYS'
      const result = new gaql().addWhere(field, operator, value)

      expect(result.conditions).toEqual(['date DURING LAST_14_DAYS'])
    })

    test('it should return error when operator is "DURING" but value is not in durings', () => {
      const field = 'date'
      const operator = 'DURING'
      const value = 'test'

      expect(() => new gaql().addWhere(field, operator, value)).toThrowError()
    })

    test('it should set string value in conditions', () => {
      const field = 'metrics.clicks'
      const operator = '>'
      const value = '135'
      const result = new gaql().addWhere(field, operator, value)

      expect(result.conditions).toEqual(['metrics.clicks > 135'])
      result.addWhere(field, operator, '200')
      expect(result.conditions).toEqual(['metrics.clicks > 135', 'AND metrics.clicks > 200'])
    })

    test('it should return error when field input is not string', () => {
      expect(() => new gaql().addWhere(1, operator, value)).toThrowError()
    })
    test('it should return error when operator input is not string', () => {
      expect(() => new gaql().addWhere(field, 1, value)).toThrowError()
    })
    test('it should return error when value input is not string', () => {
      expect(() => new gaql().addWhere(field, operator, 1)).toThrowError()
    })
    test('it should return error when mode input is not string', () => {
      expect(() => new gaql().addWhere(field, operator, value, 1)).toThrowError()
    })

  })

  describe('#orderBy()', () => {
    test('it should set string value in ordering', () => {
      const result = new gaql().orderBy('ASC')

      expect(result.ordering).toEqual('ASC')
    })

    test('it should return error when input is not string', () => {
      expect(() => new gaql().orderBy(2)).toThrowError()
    })

    test('it should return error when input is not one of "ASC" and "DESC"', () => {
      expect(() => new gaql().orderBy('ASCA')).toThrowError()
    })
  })

  describe('#limit()', () => {
    test('it should set string value in limit', () => {
      const result = new gaql().limit(2)

      expect(result.limitNum).toEqual(2)
    })

    test('it should return error when input is not number', () => {
      expect(() => new gaql().limit('2')).toThrowError()
    })
  })

  describe('#parameters()', () => {
    test('it should set string value in clauses', () => {
      const result = new gaql().parameters(['include_drafts = true'])

      expect(result.clauses).toEqual(['include_drafts = true'])
    })
  
    test('it should set string value in clauses', () => {
      const result = new gaql().parameters('include_drafts = true')

      expect(result.clauses).toEqual(['include_drafts = true'])
    })

    test('it should return error when input is not string', () => {
      expect(() => new gaql().parameters(2)).toThrowError()
    })
  })


  describe('#toString()', () => {
    test('it should return empty string when no input', () => {
      expect(new gaql().toString()).toBe('')
    })

    test('it should return correct string', () => {
      const result = new gaql()
        .select([
          'ad_group.id', 'ad_group_criterion.type', 'ad_group_criterion.criterion_id',
          'ad_group_criterion.keyword.text', 'ad_group_criterion.keyword.match_type'])
        .from('ad_group_criterion')
        .where('metrics.clicks > 135')
        .parameters(['include_drafts = true'])
        .orderBy('ASC')
        .limit(2)
        .toString()

      expect(result).toContain(`SELECT \n ad_group.id, \n ad_group_criterion.type, \n ad_group_criterion.criterion_id, \n ad_group_criterion.keyword.text, \n ad_group_criterion.keyword.match_type`)
      expect(result).toContain(`FROM \n ad_group_criterion`)
      expect(result).toContain(`WHERE \n metrics.clicks > 135`)
      expect(result).toContain(`LIMIT \n 2`)
      expect(result).toContain(`ORDER BY \n ASC`)
      expect(result).toContain(`PARAMETERS \n include_drafts = true`)
    })
  })
})