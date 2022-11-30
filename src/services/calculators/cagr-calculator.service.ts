/*
CAGR = ([(Ending Value / Beginning Value) ^ (1 / # of years)] - 1) * 100

base = 1 share

for each stock split:

    if from > to:

        base *= to

    else:

        base /= to

Then:

endingValue = last price * base

beginningValue = first price (* 1, duh)

# of years = sum of unique years in prices dataset
*/

export class CAGRCalculatorService {

}
