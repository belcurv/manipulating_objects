# manipulating_objects

This converts an array of objects to a different javascript object. The input array elements are objects that have a lot of common data. For example, there are only 2 dates (Feb 16 2016 or Feb 23 2016), and each "source" can sell multiple fruits. The goal was to output a new object, where "target":"value" pairs were aggregated under their respective sources and all sources were aggregated under their respective dates.

Normally, the input array would be the result of loading some remote data in via XHR or parsing with D3 etc.
