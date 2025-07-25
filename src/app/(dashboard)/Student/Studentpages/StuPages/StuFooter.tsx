'use client';

import {

  CalendarCheck,
  Mail,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';

export default function StuFooter() {
  return (
    <div className="w-full max-w-screen px-4 md:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
  

      {/* Pay School Fees */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <Mail className="w-6 h-6 text-red-500" />
          <CardTitle>Pay School Fees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <a
            href="mailto:school@example.com?subject=School Fees Payment&body=Wao, I want to pay my fees!"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded transition"
          >
            Click here to pay
          </a>
          <CardDescription className="text-sm pt-1 text-muted-foreground">
            This will open your mail to contact the school.
          </CardDescription>
        </CardContent>
      </Card>

    
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-purple-600" />
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex justify-between">
            <span>🎉 School Party</span>
            <span>25 July</span>
          </div>
          <div className="flex justify-between">
            <span>📚 Resumption</span>
            <span>8 Sept</span>
          </div>
          <div className="flex justify-between">
            <span>📝 Exam Week</span>
            <span>20 Oct</span>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
