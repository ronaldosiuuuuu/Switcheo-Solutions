/* 
    
    List out the computational inefficiencies and anti-patterns found in the code block below. 
    
    1. 'children' was destructured in props but left unused.
    2. '(blockchain :any)' suggests that blockchain can accept any data type but its likely intended to be a string representing the name of a blockchain. 
        It is better to define a specific type for 'blockchain' to improve code readability and type safety
    3. In the 'sortedBalance' filter function, there is a typo where '(lhsPriority > -99)' should be replaced with (balancePriority < -99).
        lhsPriority was not defined anywhere in the code.
    4. Repetitive Mapping observed as the code first maps 'sortedBalances' to formattedBalances, and then it maps formattedBalances to rows. 
        You can combine these mapping operations into one step for better performance.
    5. Instead of assigning the index as the key for each element, a much unique identifier could have been used.
        When using the array index, if the list items were to change positions, the system could end up updating the wrong elements thus proving problematic.

    Refactored version of code is included below : 
*/

type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo'; // defines that variable could only have these 5 specific blockchain names

interface WalletBalance { // serve as documentation allowing developers to understand expected properties of WalletBalance
    currency: string;
    amount: number;
  }
  interface FormattedWalletBalance { // serve as documentation allowing developers to understand expected properties of FormattedwalletBalance
    currency: string;
    amount: number;
    formatted: string;
  }
  interface Props extends BoxProps { 

  }
  
  const WalletPage: React.FC<Props> = (props: Props) => {
   
    const sortedBalances = useMemo(() => {
      return balances.filter((balance: WalletBalance) => {
          const balancePriority = getPriority(balance.blockchain);
          return balancePriority > -99 && balance.amount <= 0; 
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          return rightPriority - leftPriority; 
        });
    }, [balances, prices]);
  
    const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={balance.currency} // Use a unique key based on currency
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  
    return (
      <div {...rest}>
        {rows}
      </div>
    );
  }

