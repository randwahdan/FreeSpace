import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  template: `
      <div class="dialog-header">
      <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
    </div>
    <div mat-dialog-content>
      <p class="massage">{{ data.message }}</p>
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button class="cancel" (click)="closeDialog(false)">Cancel</button>
      <button   class="confirm" (click)="closeDialog(true)" cdkFocusInitial>Confirm</button>
    </div>
  `,
  styles: [`
  .dialog-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px; /* Adjust margin as needed */
      margin-top:20px;
    }
    .fa-exclamation-circle {
      font-size: 50px; /* Adjust font size as needed */
      color: #f00; /* Adjust color as needed */
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
      margin-bottom:15px;
    }
    .massage
    {
      font-size: 24px;
      padding: 7px 20px;
      text-align: center;
      text-decoration: none;
      font-weight: 550;
      line-height: 1.5;
    }
    .confirm{
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  font-size: 16px;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-weight: 550;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
.confirm:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}
.cancel{
  border-radius: 100px;
  box-shadow: rgba(128, 128, 128, 0.2) 0 -25px 18px -14px inset, rgba(128, 128, 128, 0.15) 0 1px 2px, rgba(128, 128, 128, 0.15) 0 2px 4px, rgba(128, 128, 128, 0.15) 0 4px 8px, rgba(128, 128, 128, 0.15) 0 8px 16px, rgba(128, 128, 128, 0.15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  margin-right: 10px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  font-weight: 550;
}
.cancel:hover {
  transform: scale(1.05) rotate(-1deg);
}
  `]
})
export class ConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef <ConfirmationDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData
  ) {}
  closeDialog(result: boolean): void {
    this.dialogRef.close(result);
    }
    }

    export interface ConfirmationDialogData {
    title: string;
    message: string;
    }
