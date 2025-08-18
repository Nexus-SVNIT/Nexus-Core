
import Tables from '../pages/Tables/Tables'
import AdminPanel from '../pages/Dashboard/AdminPanel.jsx'
import { CreateForm } from '../components'

import AllForms from '../pages/Forms/AllForms'

import AlumniVerification from '../pages/Alumni/AlumniVerification.jsx'
import verifyAchievement from '../pages/Achievements/verifyAchievement.jsx'
import createEvent from '../components/Events/createEvent.jsx'
import AddProject from '../components/Project/AddProject.jsx'

import MessageForm from "../components/Message/MessageForm.jsx"

import AddTeamMember from '../pages/Team/AddTeamMember.jsx'

import AdminPostPage from '../pages/Post/AdminPostPage.jsx'
import AdminPostDetail from '../pages/Post/AdminPostDetail.jsx'

import EditForm from '../components/Form/EditForm.jsx'

import AlumniUserVerification from '../components/Admin/AlumniVerification';




export const AdminRoutes = [
  {
    path: '',
    title: 'Dashboard',
    component: AdminPanel
  },

  {
    path: 'add-project',
    title: 'Add Project',
    component: AddProject
  },
  {
    path: 'forms/all',
    title: 'All Forms',
    component: AllForms
  },
  {
    path: 'forms/create',
    title: 'Create a Form',
    component: CreateForm
  },
  {
    path: 'responses',
    title: 'Responses',
    component: Tables
  },
  {
    path: 'verify-achievements',
    title: 'Verify Achievements',
    component: verifyAchievement
  },
  {
    path: 'verify-alumni',
    title: 'Verify Alumni Account',
    component: AlumniVerification
  },
  {
    path: 'create-event',
    title: 'Create Event',
    component: createEvent
  },
  {
    path: 'general-notification',
    title: 'Notify',
    component: MessageForm
  },
  {
    path: 'add-team-member',
    title: 'Add Team Member',
    component: AddTeamMember
  },
  {
    path: 'verify-posts',
    title: 'Verify Posts',
    component: AdminPostPage
  },
  {
    path: 'verify-posts/:id',
    title: 'Verify Post',
    component: AdminPostDetail
  },
  {
    path: 'forms/edit/:id',
    title: 'Edit Form',
    component: EditForm
  },
  // {
  //   path: 'merch/reference-leaderboard',
  //   title: 'Merch Reference LeaderBoard',
  //   component: AdminLeaderBoard
  // },
  {
    title: 'Alumni Verification',
    path: 'alumni-verification',
    component: AlumniUserVerification
  },
]
