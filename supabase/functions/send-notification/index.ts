
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get tasks that are due soon (within next 24 hours)
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*, profiles!inner(*)')
      .eq('completed', false)
      .gte('due_date', new Date().toISOString())
      .lte('due_date', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())

    if (error) throw error

    if (!tasks || tasks.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No tasks due soon' }),
        {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200,
        }
      )
    }

    // Get device tokens from the request body 
    const { deviceToken } = await req.json().catch(() => ({ deviceToken: null }))
    
    if (!deviceToken) {
      console.log('No device token provided, skipping push notification')
    } else {
      // Send push notification using Firebase Cloud Messaging
      const firebaseServerKey = Deno.env.get('FIREBASE_SERVER_KEY')
      
      if (!firebaseServerKey) {
        throw new Error('Firebase Server Key is not configured')
      }

      for (const task of tasks) {
        // Format the due date
        const dueDate = new Date(task.due_date)
        const formattedDate = `${dueDate.getDate()}/${dueDate.getMonth() + 1}/${dueDate.getFullYear()}`
        
        const notificationPayload = {
          to: deviceToken,
          notification: {
            title: "Task Due Soon",
            body: `"${task.title}" is due on ${formattedDate}`,
          },
          data: {
            taskId: task.id,
            dueDate: task.due_date,
          },
        }

        try {
          const fcmResponse = await fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `key=${firebaseServerKey}`,
            },
            body: JSON.stringify(notificationPayload),
          })

          const fcmResult = await fcmResponse.json()
          console.log('FCM notification sent:', fcmResult)
        } catch (fcmError) {
          console.error('Error sending FCM notification:', fcmError)
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, tasksToNotify: tasks.length }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in send-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500,
      }
    )
  }
})
