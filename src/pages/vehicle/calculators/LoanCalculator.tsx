
import { useState } from "react";
import Layout from "@/components/Layout";
import { ArrowLeft, Calculator, Calendar, CreditCard, Wallet, ArrowDownUp, ExternalLink, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface EMIDetails {
  month: number;
  beginningBalance: number;
  emi: number;
  interest: number;
  principal: number;
  endingBalance: number;
}

const LoanCalculator = () => {
  const [loanType, setLoanType] = useState("car");
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [interestRate, setInterestRate] = useState<number | "">(10);
  const [loanTerm, setLoanTerm] = useState<number | "">(3);
  const [processingFee, setProcessingFee] = useState<number | "">(1);
  const [emi, setEmi] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [totalProcessingFee, setTotalProcessingFee] = useState<number | null>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<EMIDetails[]>([]);
  
  const { toast } = useToast();

  const calculateEMI = () => {
    if (typeof loanAmount !== "number" || typeof interestRate !== "number" || typeof loanTerm !== "number") {
      toast({
        title: "Validation Error",
        description: "Please enter valid numbers for all fields",
        variant: "destructive",
      });
      return;
    }

    // Monthly interest rate
    const monthlyRate = interestRate / 12 / 100;
    
    // Total number of months
    const totalMonths = loanTerm * 12;
    
    // EMI calculation formula: [P x R x (1+R)^N]/[(1+R)^N-1]
    const emiValue = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                     (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const totalInterestValue = (emiValue * totalMonths) - loanAmount;
    const totalAmountValue = loanAmount + totalInterestValue;
    
    // Processing fee calculation with GST
    const processingFeeValue = typeof processingFee === "number" ? 
      (loanAmount * processingFee / 100) : 0;
    const processingFeeGST = processingFeeValue * 0.18; // 18% GST
    const totalProcessingFeeValue = processingFeeValue + processingFeeGST;

    // Generate amortization schedule
    const schedule: EMIDetails[] = [];
    let remainingBalance = loanAmount;
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = emiValue - interestPayment;
      const endBalance = remainingBalance - principalPayment;
      
      schedule.push({
        month,
        beginningBalance: remainingBalance,
        emi: emiValue,
        interest: interestPayment,
        principal: principalPayment,
        endingBalance: endBalance
      });
      
      remainingBalance = endBalance;
    }

    // Update state
    setEmi(emiValue);
    setTotalInterest(totalInterestValue);
    setTotalAmount(totalAmountValue);
    setTotalProcessingFee(totalProcessingFeeValue);
    setAmortizationSchedule(schedule);

    toast({
      title: "EMI Calculated",
      description: `Monthly EMI: ₹${emiValue.toFixed(2)}, Total Interest: ₹${totalInterestValue.toFixed(2)}, Processing Fee (with GST): ₹${totalProcessingFeeValue.toFixed(2)}`,
      variant: "default",
    });
  };

  const getLoanTypes = () => {
    return [
      { value: "personal", label: "Personal Loan", rate: 12, fee: 2 },
      { value: "car", label: "Car Loan", rate: 10, fee: 1 },
      { value: "bike", label: "Bike Loan", rate: 11, fee: 1.5 },
      { value: "home", label: "Home Loan", rate: 8, fee: 0.5 },
      { value: "education", label: "Education Loan", rate: 9, fee: 1 }
    ];
  };

  const handleLoanTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedType = e.target.value;
    setLoanType(selectedType);
    
    // Update interest rate and processing fee based on loan type
    const option = getLoanTypes().find(opt => opt.value === selectedType);
    if (option) {
      setInterestRate(option.rate);
      setProcessingFee(option.fee);
    }
  };

  const getTotalAnnualCost = () => {
    if (emi === null || totalProcessingFee === null) return 0;
    return emi * 12 + totalProcessingFee;
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/vehicle" className="mr-4">
            <ArrowLeft className="text-titeh-primary" />
          </Link>
          <h1 className="text-2xl font-bold text-titeh-primary">Loan Calculator</h1>
        </div>

        <Tabs defaultValue="emi" className="mb-8">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
            <TabsTrigger value="schedule">Amortization Schedule</TabsTrigger>
            <TabsTrigger value="comparison">Loan Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="emi">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">EMI Calculator</CardTitle>
                <CardDescription>
                  Calculate your Equated Monthly Installment (EMI) and total loan cost
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanType">Loan Type</Label>
                    <select 
                      id="loanType"
                      className="w-full border border-gray-300 rounded-md p-2"
                      value={loanType}
                      onChange={handleLoanTypeChange}
                    >
                      {getLoanTypes().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      placeholder="e.g., 100000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 10"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="loanTerm">Loan Term (years)</Label>
                    <Input
                      id="loanTerm"
                      type="number"
                      placeholder="e.g., 3"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value ? Number(e.target.value) : "")}
                    />
                  </div>

                  <div>
                    <Label htmlFor="processingFee">Processing Fee (%)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 1"
                      value={processingFee}
                      onChange={(e) => setProcessingFee(e.target.value ? Number(e.target.value) : "")}
                    />
                    <p className="text-xs text-gray-500 mt-1">18% GST applicable on processing fee</p>
                  </div>
                </div>

                <Button 
                  className="w-full bg-titeh-primary hover:bg-blue-600"
                  onClick={calculateEMI}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate EMI
                </Button>

                {emi !== null && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Loan Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Monthly EMI:</span>
                        <span className="font-semibold">₹{emi.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest Payable:</span>
                        <span>₹{totalInterest?.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>₹{(totalProcessingFee ?? 0).toFixed(2)} (incl. GST)</span>
                      </div>
                      <div className="flex justify-between font-bold border-t pt-1 mt-1">
                        <span>Total Payment:</span>
                        <span>₹{((totalAmount ?? 0) + (totalProcessingFee ?? 0)).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        First year cost: ₹{getTotalAnnualCost().toFixed(2)} (12 EMIs + Processing Fee)
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <a 
                  href="https://www.rbi.org.in/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-titeh-primary hover:underline text-xs flex items-center"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Learn more about interest rates on RBI website
                </a>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Amortization Schedule</CardTitle>
                <CardDescription>
                  View your loan repayment schedule with principal and interest breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                {amortizationSchedule.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    Calculate EMI first to view the amortization schedule
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Month</th>
                          <th className="py-2 text-right">Payment</th>
                          <th className="py-2 text-right">Principal</th>
                          <th className="py-2 text-right">Interest</th>
                          <th className="py-2 text-right">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Show only first year, then key years, then last payment */}
                        {amortizationSchedule.filter((entry, index, arr) => {
                          // First year
                          if (entry.month <= 12) return true;
                          // Last payment
                          if (entry.month === arr.length) return true;
                          // Annual entries (12, 24, 36, etc.)
                          if (entry.month % 12 === 0) return true;
                          return false;
                        }).map((entry) => (
                          <tr key={entry.month} className="border-b">
                            <td className="py-2">{entry.month}</td>
                            <td className="py-2 text-right">₹{entry.emi.toFixed(2)}</td>
                            <td className="py-2 text-right">₹{entry.principal.toFixed(2)}</td>
                            <td className="py-2 text-right">₹{entry.interest.toFixed(2)}</td>
                            <td className="py-2 text-right">₹{entry.endingBalance.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  disabled={amortizationSchedule.length === 0} 
                  variant="outline"
                  className="flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Full Schedule
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Comparison</CardTitle>
                <CardDescription>
                  Compare different loan options and find the best terms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                      Personal Loan
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>10-15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>1-2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenure:</span>
                        <span>1-5 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Amount:</span>
                        <span>₹10 lakh</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Car className="h-4 w-4 mr-2 text-green-600" />
                      Car Loan
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>8-12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>0.5-1.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenure:</span>
                        <span>1-7 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Amount:</span>
                        <span>85% of car value</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Bike className="h-4 w-4 mr-2 text-amber-600" />
                      Bike Loan
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>9-15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>1-2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenure:</span>
                        <span>1-3 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Amount:</span>
                        <span>85% of bike value</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 flex items-center">
                      <Wallet className="h-4 w-4 mr-2 text-purple-600" />
                      Used Vehicle Loan
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Interest Rate:</span>
                        <span>11-16%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>1-2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tenure:</span>
                        <span>1-5 years</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Amount:</span>
                        <span>70-80% of vehicle value</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Prepayment Options</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Personal Loans: 2-5% prepayment penalty</li>
                    <li>Car Loans: 0-3% prepayment penalty</li>
                    <li>Bike Loans: 1-3% prepayment penalty</li>
                    <li>Top banks like SBI, HDFC, and ICICI offer lower prepayment charges</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <a 
                    href="https://www.sbi.co.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-titeh-primary hover:underline text-xs"
                  >
                    SBI Loan Products
                  </a>
                  <a 
                    href="https://www.hdfcbank.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-titeh-primary hover:underline text-xs"
                  >
                    HDFC Bank Loan Products
                  </a>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
