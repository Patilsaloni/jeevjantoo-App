import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NgForOf, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DirectoryPage {
//   directoryItems = [
//   {
//     label: 'Clinics',
//     svgPath: 'assets/icons/clinic.svg',
//     gradient: 'linear-gradient(135deg, #f9fafc 0%, #fbeec1 100%)',  // pale cream to yellow
//     route: 'clinics'
//   },
//   {
//     label: 'NGOs',
//     svgPath: 'assets/icons/ngo.svg',
//     gradient: 'linear-gradient(135deg, #f0f0f0 0%, #d7dde1 100%)',  // very soft grey blues
//     route: 'ngos'
//   },
//   {
//     label: 'Events',
//     svgPath: 'assets/icons/event.svg',
//     gradient: 'linear-gradient(135deg, #e9f0f3 0%, #d9e7ff 100%)',  // very pale blues
//     route: 'events'
//   },
//   {
//     label: 'ABC',
//     svgPath: 'assets/icons/abc.svg',
//     gradient: 'linear-gradient(135deg, #fffcea 0%, #f5f0c7 100%)',  // soft creamy yellows
//     route: 'abc'
//   },
//   {
//     label: 'Ambulance',
//     svgPath: 'assets/icons/ambulance.svg',
//     gradient: 'linear-gradient(135deg, #ffe3e3 0%, #f9c1c1 100%)',  // soft pink to pastel red
//     route: 'ambulance'
//   },
//   {
//     label: 'Boarding',
//     svgPath: 'assets/icons/boarding.svg',
//     gradient: 'linear-gradient(135deg, #fdf6edff 0%, #d8c9b1 100%)',  // pale tans and beiges
//     route: 'boarding'
//   },
//   {
//     label: 'Govt Helpline',
//     svgPath: 'assets/icons/helpline.svg',
//     gradient: 'linear-gradient(135deg, #e3f1ff 0%, #cbe1ff 100%)',  // pale, calm blues
//     route: 'ghelpline'
//   },
//   {
//     label: 'Feeding',
//     svgPath: 'assets/icons/feeding.svg',
//     gradient: 'linear-gradient(135deg, #f3f3f3 0%, #dddede 100%)',  // very greys
//     route: 'feeding'
//   },
//   {
//     label: 'Medical Insurance',
//     svgPath: 'assets/icons/insurance.svg',
//     gradient: 'linear-gradient(135deg, #f7fafdff 0%, #d1e8ff 100%)',  // soft sky blues
//     route: 'insurance'
//   }
// ];

directoryItems = [
  {
    label: 'Clinics',
    svgPath: 'assets/icons/clinic.svg',
    bg: `linear-gradient(135deg, #fffde7 0%, #f9f5c7 100%)`,
    bgRepeat: 'repeat',
    route: 'clinics',
  },
  {
    label: 'NGOs',
    svgPath: 'assets/icons/ngo.svg',
    bg: `linear-gradient(135deg, #e6e6e6 0%, #d3d3d3 100%)`,
    bgRepeat: 'repeat',
    route: 'ngos',
  },
  {
    label: 'Events',
    svgPath: 'assets/icons/event.svg',
    bg: `linear-gradient(135deg, #ebf2ff 0%, #c1d2ff 100%)`,
    bgRepeat: 'repeat',
    route: 'events',
  },
  {
    label: 'ABC',
    svgPath: 'assets/icons/abc.svg',
    bg: `linear-gradient(135deg, #fffbea 0%, #f8f1c3 100%)`,
    bgRepeat: 'repeat',
    route: 'abc',
  },
  {
    label: 'Ambulance',
    svgPath: 'assets/icons/ambulance.svg',
    bg: `linear-gradient(135deg, #fff5f5ff 0%, #fcdada 100%)`,
    bgRepeat: 'repeat',
    route: 'ambulance',
  },
  {
    label: 'Boarding',
    svgPath: 'assets/icons/boarding.svg',
    bg: `linear-gradient(135deg, rgb(208 240 215) 0%, rgb(163 215 167) 100%)`,
    bgRepeat: 'repeat',
    route: 'boarding',
  },
  {
    label: 'Govt Helpline',
    svgPath: 'assets/icons/helpline.svg',
    bg: `linear-gradient(135deg, #e4f1ff 0%, #cde2ff 100%)`,
    bgRepeat: 'repeat',
    route: 'ghelpline',
  },
  {
    label: 'Feeding',
    svgPath: 'assets/icons/feeding.svg',
    bg: `linear-gradient(135deg, #fbf2ff 0%, #e2b1ff 100%) `,
    bgRepeat: 'repeat',
    route: 'feeding',
  },
  {
    label: 'Medical Insurance',
    svgPath: 'assets/icons/insurance.svg',
    bg: `linear-gradient(135deg, #e8f3ff 0%, #d9eaff 100%)`,
    bgRepeat: 'repeat',
    route: 'insurance',
  }
];

  constructor(private router: Router) {}

  goToDirectoryDetail(item: any) {
    // Tabs ke child route ke liye
    this.router.navigate([`/tabs/directory/${item.route}`]);
  }
}
