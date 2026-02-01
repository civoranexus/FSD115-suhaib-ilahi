import { useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { FiDownload, FiEye } from 'react-icons/fi'

const Payments = () => {
  const payments = [
    {
      _id: '1',
      amount: 1500,
      status: 'completed',
      date: new Date(),
      method: 'Credit Card',
      reference: 'TXN-001',
    },
    {
      _id: '2',
      amount: 2500,
      status: 'completed',
      date: new Date(),
      method: 'Bank Transfer',
      reference: 'TXN-002',
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Payments & Invoices</h1>

      <div className="space-y-4">
        {payments.map(payment => (
          <Card key={payment._id}>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-semibold text-lg">{formatCurrency(payment.amount)}</p>
                  <Badge variant="success">{payment.status}</Badge>
                </div>
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>Date: {formatDateTime(payment.date)}</span>
                  <span>Method: {payment.method}</span>
                  <span>Ref: {payment.reference}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm">
                  <FiEye className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm">
                  <FiDownload className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Payments
