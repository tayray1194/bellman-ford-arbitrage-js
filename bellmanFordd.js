const Decimal = require('decimal.js')
Decimal.set({ precision: 17 })

function negate_logarithm_convertor(graph)
{
  return graph.map(row => row.map(e => Decimal(e).ln().mul(-1)));
}

function arbitrage(currency_tuple, rates_matrix)
{
  const trans_graph = negate_logarithm_convertor(rates_matrix);
  const source = Decimal(0)
  const n = trans_graph.length;
  const min_dist = []
  const pre = [];
  for (let i = 0; i < n; i += 1)
  {
    min_dist.push(new Decimal('1e501'));
    pre.push([-1])
  }
  min_dist[source] = source;
// 'Relax edges |V-1| times'
  for (let i = 0; i < n; i += 1)
  {
    for (let source_curr = 0; source_curr < n; source_curr += 1)
    {
      for (let dest_curr = 0; dest_curr < n; dest_curr += 1)
      {
        // print(source_curr, dest_curr)
        if(min_dist[dest_curr].gt(min_dist[source_curr].add(trans_graph[source_curr][dest_curr])))
        {
          min_dist[dest_curr] = min_dist[source_curr].add(trans_graph[source_curr][dest_curr])
          pre[dest_curr] = source_curr
        }
      }
    }
  }
// for (let i = 0; i < n; i += 1) {
// if we can still relax edges, then we have a negative cycle
  for (let source_curr = 0; source_curr < n; source_curr += 1)
  {
    console.log("N",source_curr )
    for (let dest_curr = 0; dest_curr < n; dest_curr += 1)
    {
      if(min_dist[dest_curr].gt(min_dist[source_curr].add(trans_graph[source_curr][dest_curr])))
      {
        const print_cycle = [dest_curr, source_curr];
        console.log(print_cycle)
        // # Start from the source and go backwards until you see the source vertex again or any vertex that already exists in print_cycle array
        while(!print_cycle.includes(pre[source_curr]))
        {
          print_cycle.push(pre[source_curr])
          source_curr = pre[source_curr]
        }
        print_cycle.push(pre[source_curr])
        console.log("Arbitrage Opportunity: \n")
        console.log("dest", currencies[dest_curr])
        console.log(print_cycle.reverse().map(e => currencies[e]))
        //console.log(" --> ".join([currencies[p] for p in print_cycle[::-1]]))
      }
    }
  }
}
// }
const rates = [
[1, 0.23, 0.25, 16.43, 18.21, 4.94],
[4.34, 1, 1.11, 71.40, 79.09, 21.44],
[3.93, 0.90, 1, 64.52, 71.48, 19.37],
[0.061, 0.014, 0.015, 1, 1.11, 0.30],
[0.055, 0.013, 0.014, 0.90, 1, 0.27],
[0.20, 0.047, 0.052, 3.33, 3.69, 1],
]
const currencies = ['PLN', 'EUR', 'USD', 'RUB', 'INR', 'MXN']
arbitrage(currencies, rates);
