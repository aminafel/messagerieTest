import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-instant-invitation',
  templateUrl: './instant-invitation.component.html',
  styleUrls: ['./instant-invitation.component.css']
})
export class InstantInvitationComponent  {
  @Input()
invitation: string;
}
