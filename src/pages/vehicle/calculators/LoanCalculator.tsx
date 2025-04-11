import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { Calculator, CreditCard, Percent, BarChart3, ArrowRight } from "lucide-react";

interface LoanHistoryItem {
  id: string;
  date: string;
  loanType: string;
  amount: number;
  interest: number;
  term: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

const LoanCalculator = () => {
  const { toast } = useToast();
  const [loanType, setLoanType] = useState<string>("personal");
  const [amount, setAmount] = useState<string>("100000");
  const [interest, setInterest] = useState<string>("10");
  const [term, setTerm] = useState<string>("36");
  const [processingFee, setProcessingFee] = useState<string>("1");
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [loanHistory, setLoanHistory] = useState<LoanHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);
  const [prepaymentAmount, setPrepaymentAmount] = useState<string>("0");
  const [prepaymentMonth, setPrepaymentMonth] = useState<string>("12");
  const [prepaymentSavings, setPrepaymentSavings] = useState<number | null>(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("loanHistory");
    if (savedHistory) {
      setLoanHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateLoan = () => {
    const p = parseFloat(amount);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseFloat(term);
    
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid values for all fields.",
        variant: "destructive",
      });
      return;
    }

    // EMI calculation: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const calculatedEmi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const calculatedTotalAmount = calculatedEmi * n;
    const calculatedTotalInterest = calculatedTotalAmount - p;
    
    // Processing fee and GST calculation
    const processingFeeAmount = (p * parseFloat(processingFee)) / 100;
    const calculatedGstAmount = processingFeeAmount * 0.18; // 18% GST on processing fee
    const calculatedFinalAmount = calculatedTotalAmount + processingFeeAmount + calculatedGstAmount;

    setEmi(Math.round(calculatedEmi * 100) / 100);
    setTotalInterest(Math.round(calculatedTotalInterest * 100) / 100);
    setTotalAmount(Math.round(calculatedTotalAmount * 100) / 100);
    setGstAmount(Math.round(calculatedGstAmount * 100) / 100);
    setFinalAmount(Math.round(calculatedFinalAmount * 100) / 100);

    // Generate amortization schedule
    generateAmortizationSchedule(p, r, n, calculatedEmi);

    // Calculate prepayment savings if applicable
    if (parseFloat(prepaymentAmount) > 0 && parseFloat(prepaymentMonth) > 0) {
      calculatePrepaymentSavings();
    }

    // Save to history
    const newHistoryItem: LoanHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      loanType,
      amount: p,
      interest: parseFloat(interest),
      term: n,
      emi: Math.round(calculatedEmi * 100) / 100,
      totalInterest: Math.round(calculatedTotalInterest * 100) / 100,
      totalAmount: Math.round(calculatedTotalAmount * 100) / 100,
    };

    const updatedHistory = [...loanHistory, newHistoryItem];
    setLoanHistory(updatedHistory);
    localStorage.setItem("loanHistory", JSON.stringify(updatedHistory));

    toast({
      title: "Loan Calculated",
      description: `Your EMI: ₹${Math.round(calculatedEmi)}`,
    });
  };

  const generateAmortizationSchedule = (principal: number, monthlyRate: number, months: number, emi: number) => {
    let balance = principal;
    let schedule = [];
    let totalInterestPaid = 0;

    // Group by year to keep the table manageable
    const monthsPerYear = 12;
    const years = Math.ceil(months / monthsPerYear);
    
    for (let year = 1; year <= years; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;
      
      for (let month = 1; month <= monthsPerYear; month++) {
        const monthNumber = (year - 1) * monthsPerYear + month;
        if (monthNumber > months) break;
        
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = emi - interestForMonth;
        
        balance -= principalForMonth;
        totalInterestPaid += interestForMonth;
        
        yearlyPrincipal += principalForMonth;
        yearlyInterest += interestForMonth;
      }
      
      schedule.push({
        year,
        principalPaid: Math.round(yearlyPrincipal * 100) / 100,
        interestPaid: Math.round(yearlyInterest * 100) / 100,
        totalPaid: Math.round((yearlyPrincipal + yearlyInterest) * 100) / 100,
        remainingBalance: Math.max(0, Math.round(balance * 100) / 100),
      });
    }

    setAmortizationSchedule(schedule);
  };

  const calculatePrepaymentSavings = () => {
    const p = parseFloat(amount);
    const r = parseFloat(interest) / 12 / 100;
    const n = parseFloat(term);
    const prepayment = parseFloat(prepaymentAmount);
    const prepayMonth = parseFloat(prepaymentMonth);
    
    if (isNaN(prepayment) || isNaN(prepayMonth) || prepayment <= 0 || prepayMonth <= 0 || prepayMonth >= n) {
      toast({
        title: "Invalid Prepayment",
        description: "Please enter valid prepayment amount and month.",
        variant: "destructive",
      });
      setPrepaymentSavings(null);
      return;
    }

    // Original EMI calculation
    const originalEmi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    const originalTotalAmount = originalEmi * n;
    
    // Calculate balance after prepayment month
    let balance = p;
    let totalPaid = 0;
    
    for (let i = 1; i <= prepayMonth; i++) {
      const interestForMonth = balance * r;
      const principalForMonth = originalEmi - interestForMonth;
      
      balance -= principalForMonth;
      totalPaid += originalEmi;
      
      if (i === prepayMonth) {
        // Apply prepayment
        balance -= prepayment;
        totalPaid += prepayment;
      }
    }
    
    // Recalculate EMI for remaining term
    const remainingMonths = n - prepayMonth;
    const newEmi = balance > 0 ? balance * r * Math.pow(1 + r, remainingMonths) / (Math.pow(1 + r, remainingMonths) - 1) : 0;
    const newRemainingTotal = newEmi * remainingMonths;
    const totalWithPrepayment = totalPaid + newRemainingTotal;
    
    const savings = originalTotalAmount - totalWithPrepayment;
    setPrepaymentSavings(Math.round(savings * 100) / 100);
    
    toast({
      title: "Prepayment Calculated",
      description: `You would save approximately ₹${Math.round(savings)} with this prepayment.`,
    });
  };

  const clearHistory = () => {
    setLoanHistory([]);
    localStorage.removeItem("loanHistory");
    toast({
      title: "History Cleared",
      description: "Your loan calculation history has been cleared.",
    });
  };

  const loanTypeOptions = [
    { value: "personal", label: "Personal Loan", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { value: "car", label: "Car Loan", icon: <Card className="mr-2 h-4 w-4" /> },
    { value: "bike", label: "Bike Loan", icon: <Card className="mr-2 h-4 w-4" /> },
    { value: "home", label: "Home Loan", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { value: "education", label: "Education Loan", icon: <CreditCard className="mr-2 h-4 w-4" /> },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-titeh-primary">Loan Calculator</h1>

        <Tabs defaultValue="calculator" className="mb-6">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="calculator" className="flex-1">Calculator</TabsTrigger>
            <TabsTrigger value="amortization" className="flex-1">Amortization Table</TabsTrigger>
            <TabsTrigger value="prepayment" className="flex-1">Prepayment</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 text-titeh-primary" />
                  Loan EMI Calculator
                </CardTitle>
                <CardDescription>
                  Calculate your EMI, total interest and payment schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="loanType">Loan Type</Label>
                    <Select value={loanType} onValueChange={setLoanType}>
                      <SelectTrigger id="loanType">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="flex items-center">
                            <div className="flex items-center">
                              {option.icon}
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g., 100000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interest">Interest Rate (% per annum)</Label>
                    <Input
                      id="interest"
                      type="number"
                      value={interest}
                      onChange={(e) => setInterest(e.target.value)}
                      placeholder="e.g., 10.5"
                      step="0.1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="term">Loan Term (months)</Label>
                    <Input
                      id="term"
                      type="number"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      placeholder="e.g., 36"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Processing Fee (%)</Label>
                    <Input
                      id="processingFee"
                      type="number"
                      value={processingFee}
                      onChange={(e) => setProcessingFee(e.target.value)}
                      placeholder="e.g., 1.0"
                      step="0.1"
                    />
                  </div>
                </div>

                <Button onClick={calculateLoan} className="w-full bg-titeh-primary hover:bg-blue-600 mb-4">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate EMI
                </Button>

                {emi > 0 && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">Monthly EMI</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{emi.toLocaleString()}</p>
                      </Card>
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">Total Interest</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{totalInterest.toLocaleString()}</p>
                      </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">Total Principal</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{parseFloat(amount).toLocaleString()}</p>
                      </Card>
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">Total Payment</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{totalAmount.toLocaleString()}</p>
                      </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">GST (18% on processing fee)</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{gstAmount.toLocaleString()}</p>
                      </Card>
                      <Card className="p-4 bg-blue-50">
                        <p className="text-sm text-gray-600">Final Amount (with fees & GST)</p>
                        <p className="text-2xl font-bold text-titeh-primary">₹{finalAmount.toLocaleString()}</p>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="amortization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 text-titeh-primary" />
                  Yearly Amortization Schedule
                </CardTitle>
                <CardDescription>
                  See how your loan balance reduces over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {amortizationSchedule.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Year</TableHead>
                          <TableHead>Principal Paid</TableHead>
                          <TableHead>Interest Paid</TableHead>
                          <TableHead>Total Payment</TableHead>
                          <TableHead>Remaining Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {amortizationSchedule.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell>{row.year}</TableCell>
                            <TableCell>₹{row.principalPaid.toLocaleString()}</TableCell>
                            <TableCell>₹{row.interestPaid.toLocaleString()}</TableCell>
                            <TableCell>₹{row.totalPaid.toLocaleString()}</TableCell>
                            <TableCell>₹{row.remainingBalance.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Calculate a loan to see the amortization schedule</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prepayment">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="mr-2 text-titeh-primary" />
                  Prepayment Calculator
                </CardTitle>
                <CardDescription>
                  Calculate potential savings with partial prepayment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="prepaymentAmount">Prepayment Amount (₹)</Label>
                    <Input
                      id="prepaymentAmount"
                      type="number"
                      value={prepaymentAmount}
                      onChange={(e) => setPrepaymentAmount(e.target.value)}
                      placeholder="e.g., 20000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prepaymentMonth">Prepayment Month (from start)</Label>
                    <Input
                      id="prepaymentMonth"
                      type="number"
                      value={prepaymentMonth}
                      onChange={(e) => setPrepaymentMonth(e.target.value)}
                      placeholder="e.g., 12"
                    />
                  </div>
                </div>

                <Button onClick={calculatePrepaymentSavings} className="w-full bg-titeh-primary hover:bg-blue-600 mb-4">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Savings
                </Button>

                {prepaymentSavings !== null && (
                  <div className="mt-4">
                    <Card className="p-4 bg-green-50">
                      <p className="text-sm text-gray-600">Total Interest Savings</p>
                      <p className="text-2xl font-bold text-green-600">₹{prepaymentSavings.toLocaleString()}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        By making a prepayment of ₹{parseFloat(prepaymentAmount).toLocaleString()} in month {prepaymentMonth}, 
                        you would save approximately ₹{prepaymentSavings.toLocaleString()} in interest over the loan term.
                      </p>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="mr-2 text-titeh-primary" />
                    Loan Calculation History
                  </div>
                  {loanHistory.length > 0 && (
                    <Button variant="outline" onClick={clearHistory}>
                      Clear History
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  View your previous loan calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loanHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Loan Type</TableHead>
                          <TableHead>Amount (₹)</TableHead>
                          <TableHead>Interest (%)</TableHead>
                          <TableHead>Term (months)</TableHead>
                          <TableHead>EMI (₹)</TableHead>
                          <TableHead>Total Interest (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loanHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="capitalize">{item.loanType}</TableCell>
                            <TableCell>{item.amount.toLocaleString()}</TableCell>
                            <TableCell>{item.interest}%</TableCell>
                            <TableCell>{item.term}</TableCell>
                            <TableCell>{item.emi.toLocaleString()}</TableCell>
                            <TableCell>{item.totalInterest.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No loan calculation history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-4 bg-blue-50">
          <div className="flex items-center">
            <ArrowRight className="text-titeh-primary mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm">
                This calculator provides estimates only. Actual EMIs may vary based on bank policies.
                Consult your financial advisor before making any loan decisions.
              </p>
              <a 
                href="https://www.rbi.org.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-blue-600 hover:underline mt-1 inline-block"
              >
                Learn more about interest rates at RBI.org.in
              </a>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LoanCalculator;
