import { Component,OnInit,ViewChild } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { EventModel } from '../../models/Event.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../environment";
import {SharedService} from "../../services/shared.service";
import { UserModel } from '../../models/user-model';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'create-event',
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEvent implements OnInit{
  eventForm: FormGroup;
  selectedFiles: File[] | null = null;
  user:UserModel;
  @ViewChild('fileInput') fileInputImage: any;
  cities: string[] = [];

  constructor(
    private router: Router,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private http: HttpClient,
    private sharedService:SharedService
  ) {
    this.eventForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      category: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      link: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
  }
  ngOnInit(): void {
    let userStorage = localStorage.getItem('user');
    this.user = userStorage ? JSON.parse(userStorage) : null;

    this.sharedService.events$.subscribe((isEventCreated) => {
      if (isEventCreated) {
        let userStorage = localStorage.getItem('user');
        this.user = userStorage ? JSON.parse(userStorage) : null;
      }
    });
  }
  updateCities() {
    const countryControl = this.eventForm.get('country');
    if (countryControl) {
      const country = countryControl.value;
      switch (country) {
        case 'Egypt':
          this.cities = [
            'Cairo', 'Alexandria', 'Giza', 'Shubra El Kheima', 'Port Said', 'Suez', 'Luxor', 'Mansoura', 'El-Mahalla El-Kubra',
            'Tanta', 'Asyut', 'Ismailia', 'Fayyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef', 'Hurghada',
            'Qena', 'Sohag', 'Sheikh Zayed City', 'Banha', 'Kafr El Sheikh', 'Arish', 'Mallawi', '10th of Ramadan City', 'Bilbais',
            'Marsa Matruh', 'Idfu', 'Mit Ghamr', 'Al-Hamidiyya', 'Desouk', 'Qalyub', 'Abnub', 'Kafr El Dawwar', 'Kom Ombo',
            'Al-Qanayat', 'Shibin El Kom', 'Samalut', 'Edko', 'Bani Mazar', 'Dairut', 'Al-Matariyyah', 'Al-Minya', 'El Tor',
            'New Cairo', 'Kawm Umbu', 'Tala', 'Akhmim', 'Siwa Oasis', 'Al Fayyum', 'Abu Kabir', 'Al-Darb al-Ahmar',
            'Al-Sharqia', 'Sidi Salim', 'El Mahalla', 'Ashmoun', 'El Matareya', 'El-Tor', 'El-Mahalla El-Kubra', 'El-Qanayat',
            'El-Tor', 'El-Zagazig', 'Faiyum', 'Kafr el-Sheikh', 'Kom Ombo', 'Mansoura', 'Marsa Matruh', 'Mit Ghamr', 'Shibin al-Qanatir',
            'Shubra El Kheima', 'Siwa', 'Sohag', 'Tanta', 'Zagazig'
          ];
          break;
          case 'Afghanistan':
          this.cities = [
          'Kabul', 'Herat', 'Mazar-i-Sharif', 'Kandahar', 'Jalalabad', 'Kunduz', 'Lashkar Gah', 'Taloqan', 'Puli Khumri',
          'Charikar', 'Sheberghan', 'Sar-e Pol', 'Maymana', 'Ghazni', 'Balkh', 'Farah', 'Pul-i-Alam', 'Samangan', 'Fayzabad',
          'Bamyan', 'Khost', 'Gardez', 'Parun', 'Zaranj', 'Bazarak', 'Asadabad', 'Nili', 'Maimana', 'Tarin Kowt', 'Kunduz',
          'Khost', 'Ghazni', 'Fayzabad', 'Bamiyan', 'Balkh', 'Baghlan', 'Andkhoy', 'Aibak', 'Asmar', 'Almar', 'Achin',
          'Kishindih', 'Dawlatabad', 'Jurm', 'Dasht-e-Archi', 'Chaghcharan', 'Darzab', 'Deh Rawood', 'Dushi', 'Gereshk',
          'Ghormach', 'Jaghuri', 'Jalrez', 'Karukh', 'Khanabad', 'Khulm', 'Khwaja Ghar', 'Khwahan', 'Khwaja Bahauddin',
          'Kishim', 'Kohistan', 'Kohsan', 'Kushk', 'Kushk-e-Nakhud', 'Langar', 'Lataband', 'Lewan', 'Lul Bagh', 'Maiwand',
          'Mehmend', 'Musa Qala', 'Nahrin', 'Nahr-e Saraj', 'Nawa', 'Nuristan', 'Orgun', 'Obeh', 'Omna', 'Panjsher', 'Qala-e-Naw',
          'Qala i Naw', 'Qalat', 'Qarabagh', 'Qarghayi', 'Qush Tepa', 'Ramak', 'Rostaq', 'Rudbar', 'Said Karam', 'Sar-i-Pul',
          'Sartuk', 'Sharan', 'Shibarghan', 'Shinkay', 'Shinwar', 'Shirin Tagab', 'Shorabak', 'Shulgara', 'Takhar', 'Tegab',
          'Tiran', 'Uruzgan', 'Waras', 'Washir', 'Wurduj', 'Yakawlang', 'Yangi Qala', 'Yawan', 'Yawan', 'Yechi', 'Zebak'
          ];
        break;
        case 'Saudi Arabia':
          this.cities = [
            'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Taif', 'Tabuk', 'Abha', 'Buraidah', 'Hail',
            'Najran', 'Al Khafji', 'Al Qatif', 'Al Kharj', 'Al Majmaah', 'Al Mubarraz', 'Al Hufuf', 'Al Jubail', 'Al Qurayyat',
            'Arar', 'Sakaka', 'Yanbu', 'Hafar Al-Batin', 'Ha il', 'Al Bahah', 'Al Wajh', 'Ar Rass', 'Ad Dawadimi', 'Al Lith',
            'Al Zulfi', 'Dhahran', 'Jizan', 'Al-`Ula', 'Al Bukayriyah', 'Al Namas', 'Duba', 'Qurayyat', 'Rafha', 'Ras Tanura',
            'Sabya', 'Safwa', 'Shaqraa', 'Turaif', 'Tayma', 'Umm Lajj', 'Umluj', 'Al Duwadimi', 'Al Artaweeiyah', 'Al Haditha',
            'Al Khobar', 'Al Qunfudhah', 'Al Wajh', 'An Nimas', 'At Taraf', 'Az Zaimah', 'Badr Hunayn', 'Baljurashi',
            'Bisha', 'Buqayq', 'Dahaban', 'Dhurma', 'Diriyah', 'Duba', 'Dumat Al-Jandal', 'Farasan', 'Ghat', 'Gurayat',
            'Hajrah', 'Haradh', 'Harmah', 'Hautat Sudair', 'Hofuf', 'Hotat Bani Tamim', 'Huraymila', 'Jalajil', 'Jalmudah',
            'Jandal', 'Jizan', 'Julai`a', 'Khulays', 'Majmaah', 'Marat', 'Mastoorah', 'Mawqaq', 'Miqwa', 'Mu`ayd', 'Mubarraz',
            'Najran', 'Namas', 'Oyaynah', 'Qaisumah', 'Qaryat al Ulya', 'Qatif', 'Qunfudhah', 'Rabigh', 'Rahimah', 'Ras Tanura',
            'Riyadh Al Khabra', 'Rumailah', 'Safwa', 'Sajir', 'Sakakah', 'Salwa', 'Saqamqam', 'Shaqraa', 'Shaybah', 'Sihat',
            'Sulayyil', 'Tabuk', 'Tayma', 'Tubarjal', 'Turubah', 'Udhailiyah', 'Uhud Al-Mualla', 'Um Al-Sahek', 'Umm Ad Dawm',
            'Umm Al-Qura', 'Umm Lajj', 'Unayzah', 'Al-`Uyun', 'Al Wajh', 'Yanbu Al Bahr', 'Zulfi'
          ];
          break;
          case 'Algeria':
  this.cities = [
    'Algiers', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Djelfa', 'Sétif', 'Biskra', 'Tébessa', 'Tlemcen',
    'Béjaïa', 'Oran', 'Skikda', 'Tiaret', 'Béchar', 'El Oued', 'Boumerdes', 'Chlef', 'Sidi Bel Abbes', 'Guelma',
    'Aïn Oussera', 'Relizane', 'El Khroub', 'Jijel', 'Aïn Beïda', 'Khenchela', 'Laghouat', 'Baraki', 'Bordj Bou Arréridj',
    'Blida', 'Bouira', 'Tébessa', 'Aflou', 'Bir El Djir', 'Birine', 'Bir Mourad Raïs', 'Bir Touta', 'Birkhadem', 'Birtouta',
    'Biskra', 'Blida', 'Boghni', 'Bordj Bou Arréridj', 'Bordj Ghdir', 'Bordj Menaiel', 'Bordj Zemoura', 'Bou Ismaïl',
    'Bou Tlelis', 'Boudouaou', 'Boufarik', 'Bouinan', 'Bouira', 'Boumahra Ahmed', 'Boumerdes',
    'Boussemghoun', 'Boutlélis', 'Bouzareah', 'Bouzeguène', 'Chetouane', 'Chlef', 'Constantine', 'Dar Chioukh', 'Dellys',
    'Djamaa', 'Djelfa', 'Douera', 'Draa Ben Khedda', 'Draâ el Mizan', 'Draâ el Mizan', 'El Abadia', 'El Achir', 'El Affroun',
    'El Amria', 'El Attaf', 'El Bayadh', 'El Eulma', 'El Hadjar', 'El Harrach', 'El Kala', 'El Khroub', 'El Madher',
    'El Malah', 'El Oued', 'El Tarf', 'Es Senia', 'Es Senia', 'Fesdis', 'Frenda', 'Gouraya', 'Guelma', 'Hadjout', 'Hamma Bouziane',
    'Hamma Bouziane', 'Hassi Bahbah', 'Hassi Messaoud', 'Hassi RMel', 'Heliopolis', 'Hennaya', 'Khemis Miliana', 'Khemis el Khechna',
    'Kherrata', 'Ksar Chellala', 'Laghouat', 'Lakhdaria', 'Larbaâ', 'Larbaâ Nath Irathen', 'Lardjem', 'Larva', 'Larbaâ', 'Larbaâ',
    'Maghnia', 'Mansourah', 'Mansoura', 'Mascara', 'Médéa', 'Meftah', 'Megarine', 'Mekla', 'Merouana', 'Messaad', 'Mila',
    'Mohammadia', 'Mouzaïa', 'Naciria', 'Nâama', 'Nador', 'Oued el Abtal', 'Oued el Alleug', 'Oued el Djemaa', 'Oued Fodda',
    'Oued Rhiou', 'Oued Sly', 'Oued Taria', 'Ouled Yaïch', 'Ouled el Alleug', 'Ouled el Berdi', 'Ouled el Djemaâ', 'Ouled el Maleh',
    'Ouled el Moumen', 'Ouled Fayet', 'Ouled Mimoun', 'Ouled Moussa', 'Oum el Bouaghi', 'Râs el Oued', 'Reghaïa', 'Relizane',
    'Reghaïa', 'Robbah', 'Rouached', 'Rouiba', 'Saida', 'Saïda', 'Saoula', 'Seddouk', 'Sebdou', 'Sétif', 'Sidi Abdelli', 'Sidi Aïssa',
    'Sidi Akkacha', 'Sidi Bel Abbès', 'Sidi Djillali', 'Sidi Khaled', 'Sidi Moussa', 'Sidi Okba', 'Sidi Moussa', 'Sidi Yahia el Gharb',
    'Sidi ech Chahmi', 'Skikda', 'Sougueur', 'Souk Ahras', 'Tadjenanet', 'Tadmaya', 'Taher', 'Takdempt', 'Tala', 'Talaa El Kabira',
    'Tamanrasset', 'Tamalous', 'Tazoult-Lambese', 'Tazoult-Lambese', 'Tebesbest', 'Tebessa', 'Tébessa', 'Ténès', 'Ténezzou', 'Terny',
    'Tessala', 'Tichy', 'Tidjelabine', 'Tiaret', 'Timimoun', 'Timizart', 'Tirmitine', 'Tizi Gheniff', 'Tizi Ouzou', 'Tizi Rached',
    'Tizi-n-Tleta', 'Tlemcen', 'Touggourt', 'Zaouiet Kounta', 'Zaouiet Sidi Khaled', 'Zeralda', 'Zeribet el Oued', 'Zighoud Youcef'
  ];
  break;
  case 'Bahrain':
  this.cities = [
    'Manama', 'Riffa', 'Muharraq', 'Hamad Town', 'Aali', 'Isa Town', 'Sitra', 'Budaiya', 'Jidhafs', 'Al-Malikiyah',
    'Tubli', 'Sanabis', 'Jid Ali', 'Diyar Al Muharraq', 'Zallaq', 'Hidd', 'Al Jasra', 'Juffair', 'Zinj', 'Galali',
    'Saar', 'Bani Jamra', 'Budaiya', 'Dair', 'Dumistan', 'Al Jasra', 'Karbabad', 'Malkiya', 'Maqabah', 'Muharraq', 'Muqaba',
    'Qalali', 'Sakhir', 'Salmabad', 'Seef', 'Shahrakan', 'Sitra', 'Zallaq'
  ];
  break;
  case 'Iraq':
  this.cities = [
    'Baghdad', 'Basra', 'Mosul', 'Erbil', 'Karbala', 'Najaf', 'Kirkuk', 'Nasiriyah', 'Amara', 'Sulaymaniyah',
    'Ramadi', 'Fallujah', 'Kut', 'Duhok', 'Hilla', 'Samawah', 'Diwaniyah', 'Tikrit', 'Rutbah', 'Sinjar',
    'Kifri', 'Halabja', 'Zakho', 'Balad', 'Baqubah', 'Haditha', 'Tuz Khurmatu', 'Mandali', 'Rawah', 'Ranya',
    'Heet', 'Saqlawiyah', 'Shingal', 'Sinjar', 'Al-Qaim', 'Al-Hamdaniya', 'Al-Qurnah', 'Al-Miqdadiyah',
    'Kalar', 'Al-Diwaniyah', 'Khalis', 'Tooz', 'Daquq', 'Al-Ukhaidhir', 'Zubayr', 'Khanaqin', 'Al-Zubayr',
    'Al-Qurnah', 'Al-Mahmudiyah', 'Al-Kut', 'Al-Kifl', 'Ad-Dujail', 'Al-Hamza', 'Ar Rutba', 'Ali al-Gharbi',
    'Al-Shirqat', 'Ar Ramadi', 'Al-Muqdadiyah', 'Al-Khalis', 'Anah', 'Aqrah', 'Az Zubayr', 'Baiji', 'Al-Basrah',
    'Balad', 'Bayji', 'Baquba', 'Al-Hawija', 'Al-Hillah', 'Karbala', 'Al-Kut', 'Al-Mawsil', 'Najaf', 'An-Najaf',
    'An-Nasiriyah', 'Anah', 'As-Sulaymaniyah', 'Babil', 'Badghis', 'Baghdad', 'Baqubah', 'Basra', 'Bawi',
    'Dahuk', 'Diyala', 'Duhok', 'Fallujah', 'Halabja', 'Hilla', 'Irbil', 'Karbala', 'Kirkuk', 'Kut', 'Maysan',
    'Muthanna', 'Muzaffarabad', 'Najaf', 'Nasiriyah', 'Ninawa', 'Ramadi', 'Sala al-Din', 'Saladin', 'Samarra',
    'Shirqat', 'Sulaimaniyah', 'Tall Afar', 'Tikrit', 'Wassit'
  ];
  break;
  case 'Kuwait':
  this.cities = [
    'Kuwait City', 'Hawalli', 'Salmiya', 'Al Jahra', 'Al Farwaniyah', 'Mubarak Al-Kabeer', 'Ahmadi', 'Al Fahahil',
    'Ar Riqqah', 'Salwa', 'Sabah as Salim', 'Al Mahbulah', 'Al Fintas', 'Janub as Surrah', 'Eqaila', 'Al Manqaf',
    'Bayan', 'Al Jahra', 'Ad Dasmah', 'Ash Shamiyah', 'Sabah Al-Salem', 'Al Wafrah', 'Abu Halifa', 'Al Mangaf',
    'Al Ahmadi', 'Fahaheel', 'Jabriya', 'Al Sulaibikhat', 'Al-Ahmadi', 'Al-Farwaniyah', 'Al-Jahra', 'Al-Kabad',
    'Al-Manqaf', 'Al-Qairawan', 'Al-Riqqah', 'Al-Sabahiyah', 'Al-Salamiyah', 'Al-Shamiya', 'Al-Shuwaikh', 'Al-Sulaibikhat',
    'Al-Wafra', 'Al-Yarmouk', 'Bayan', 'Bnaid Al-Qar', 'Dasma', 'Doha', 'Doha Port', 'Duhailiyat', 'Fahad Al-Ahmad',
    'Faiha', 'Fnaitees', 'Granada', 'Hadiya', 'Hawally', 'Jaber Al-Ahmad', 'Jaber Al-Ali', 'Jaber Al-Ahmad', 'Jleeb Al-Shuyoukh',
    'Jleeb Al-Shuyoukh', 'Kaifan', 'Khaitan', 'Kuwait City', 'Mansouriya', 'Mangaf', 'Nahda', 'Nigra', 'North West Sulaibikhat',
    'Nuzha', 'Qadsiya', 'Qairawan', 'Qairouan', 'Qurain', 'Rabiya', 'Rai', 'Rawda', 'Rumathiya', 'Sabah Al-Salem Area',
    'Sabah Al-Salem Area', 'Sabahiya', 'Salam', 'Salwa', 'Salwa Sabah Al-Salem', 'Salwa-1', 'Sulaibikhat', 'Surra', 'Surra-2',
    'Surra-3', 'Tayma', 'Yarmouk', 'Zahra', 'Zahra-1', 'Zahra-2'
  ];
  break;
  case 'Lebanon':
    this.cities = [
      'Beirut', 'Tripoli', 'Sidon', 'Tyre', 'Jounieh', 'Zahle', 'Baabda', 'Batroun', 'Byblos', 'Baalbek',
      'Nabatieh', 'Jezzine', 'Zahlé', 'Zgharta', 'Bcharre', 'Keserwan', 'Chouf', 'Aley', 'Metn', 'Rashaya'
    ];
    break;
  case 'Jordan':
    this.cities = [
      'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Madaba', 'Salt', 'Mafraq', 'Jerash', 'Ma\'an',
      'Tafilah', 'Ruseifa', 'Wadi Musa', 'Ajloun', 'Sahab', 'Al Husn', 'Al Ramtha', 'Deir Alla',
    ];
    break;
    case 'Libya':
  this.cities = [
    'Tripoli', 'Benghazi', 'Misrata', 'Tarhuna', 'Sirte', 'Zawiya', 'Al Bayda', 'Zliten', 'Tobruk', 'Derna',
    'Sabha', 'Zuwara', 'Gharyan', 'Al Khums', 'Hun', 'Murzuk', 'Awbari', 'Yafran', 'Mizdah', 'Ghat'
  ];
  break;
  case 'Morocco':
  this.cities = [
    'Casablanca', 'Rabat', 'Fes', 'Marrakech', 'Agadir', 'Tangier', 'Meknes', 'Oujda', 'Kenitra', 'Tetouan',
    'Safi', 'Sale', 'Mohammedia', 'Nador', 'Al Hoceima', 'Beni Mellal', 'Fes', 'El Jadida', 'Taza', 'Settat'
  ];
  break;
  case 'Oman':
  this.cities = [
    'Muscat', 'Salalah', 'Sohar', 'Nizwa', 'Sur', 'Seeb', 'Rustaq', 'Suhar', 'Ibri', 'Ibra',
    'Khasab', 'Bahla', 'Barka', 'Al Buraimi', 'Bidbid', 'Bukha', 'Dibba Al-Baya', 'Ibri', 'Ibri', 'Ibra',
    'Ibri', 'Jalan Bani Bu Ali', 'Khasab', 'Madha', 'Masirah', 'Mirbat', 'Nakhal', 'Raysut', 'Rustaq',
    'Saham', 'Saiq', 'Salalah', 'Samail', 'Sohar', 'Sur', 'Tan`am', 'Thumrait'
  ];
  break;
  case 'Palestine':
    this.cities = [
      'Jerusalem', 'Gaza', 'Hebron', 'Nablus', 'Ramallah', 'Bethlehem', 'Jenin', 'Tulkarm', 'Qalqilya', 'Jericho',
      'Beit Sahour', 'Yatta', 'Khan Yunis', 'Rafah', 'Beit Lahia', 'Tubas', 'Salfit', 'Tammun', 'Kafr Qasim', 'Tsurif',
      'Al-Bireh', 'Dura', 'Bani Naim', 'Halhul', 'Dheisheh', 'Al-Eizariya', 'At-Tayba', 'Anabta', 'Beit Jala',
      'Deir Dibwan', 'Surda', 'Beitunia', 'Beit Ummar', 'Taqu', 'Azun', 'Hableh', 'Shufa', 'Qabatiya', 'Sa\'ir',
      'Deir Istiya', 'Zababdeh', 'Al-Yamun', 'Barta\'a', 'Al-Jalama', 'Jayyous', 'Abasan al-Kabera', 'Abasan al-Saghira',
      'Bani Suheila', 'Beit Hanoun', 'Jabalia', 'Khan Yunis', 'Rafah', 'Deir al-Balah', 'Maghazi', 'Al-Bureij',
      'Nuseirat', 'Al-Zahra', 'Khuza\'a', 'Beit Lahia', 'Beit Hanoun', 'Al-Maghazi', 'Abu Dis', 'Ad-Dhahiriya',
      'Al-Jib', 'Al-Qubeiba', 'Al-Ubeidiya', 'Az-Za\'ayyem', 'Beita', 'Beit Awwa', 'Beit Fajjar', 'Beit Iksa',
      'Beit Liqya', 'Beit Qad', 'Beit Rima', 'Beit Sahour', 'Beit Ta\'mir', 'Beit Ula', 'Beit Ummar', 'Beit Ur al-Fauqa',
      'Beit Uwwa', 'Beit Zarzir', 'Biddu', 'Bir Nabala', 'Burqa', 'Dair Sammit', 'Dura al-Qar\'', 'Habla', 'Haris',
      'Husan', 'Idhna', 'Jamma\'in', 'Jayyous', 'Kafr ad-Dik', 'Kafr Ein', 'Kafr Malik', 'Kafr Sur', 'Kafr Thulth',
      'Kafr Uqab', 'Kafr Yatta', 'Kifl Haris', 'Kufr Qallil', 'Qira', 'Ras Karkar', 'Rummana', 'Sarta', 'Shuyukh al-Arrub',
      'Shuyukh', 'Sinjil', 'Surif', 'Umm al-Khair', 'Umm Salmuna', 'Wadi al-Joz', 'Wadi Foquin', 'Yatta',
      'Zawiya', 'Zayta', 'Zububa'
    ];
    break;
    case 'Qatar':
      this.cities = [
        'Doha', 'Al Wakrah', 'Al Rayyan', 'Umm Salal', 'Al Khor', 'Al Shamal', 'Mesaieed'
      ];
      break;
      case 'Somalia':
        this.cities = [
          'Mogadishu', 'Hargeisa', 'Bosaso', 'Kismayo', 'Mereeg', 'Burao', 'Jamaame', 'Baidoa', 'Garoowe', 'Beledweyne',
          'Gaalkacyo', 'Berbera', 'Jowhar', 'Afgooye', 'Dhuusamarreeb', 'Qardho', 'Buurhakaba', 'Diinsoor', 'Ceeldheer',
          'Buulobarde', 'Jilib', 'Luuq', 'Buur Gaabo', 'Eyl', 'Saakow'
        ];
        break;
        case 'Sudan':
  this.cities = [
    'Khartoum', 'Omdurman', 'Port Sudan', 'Kassala', 'Al-Ubayyid', 'Nyala', 'Wad Madani', 'El Fasher', 'Atbara',
    'Kosti', 'El Obeid', 'Juba', 'Malakal', 'Kaduqli', 'Rabak', 'Sennar', 'Geneina', 'Haiya', 'Singa', 'El Damazin'
  ];
  break;
  case 'Syria':
  this.cities = [
    'Damascus', 'Aleppo', 'Homs', 'Hama', 'Latakia', 'Raqqa', 'Deir ez-Zor', 'Idlib', 'Daraa', 'As-Suwayda',
    'Tartus', 'Al-Hasakah', 'Qamishli', 'Manbij', 'Al-Bab', 'Salamiyah', 'Dayr Hafir', 'Jarabulus', 'Maarat al-Numan',
    'Yabroud'
  ];
  break;
  case 'Tunisia':
  this.cities = [
    'Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte', 'Gabes', 'Ariana', 'Gafsa', 'La Marsa', 'Béja',
    'Nabeul', 'Ben Arous', 'Monastir', 'Sidi Bouzid', 'Tataouine', 'Medenine', 'Mahdia', 'Kasserine', 'Zarzis',
    'Jendouba'
  ];
  break;
  case 'United Arab Emirates':
  this.cities = [
    'Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Khor Fakkan',
    'Kalba', 'Dibba Al-Hisn'
  ];
  break;
  case 'Yemen':
  this.cities = [
    'Sana\'a', 'Aden', 'Taiz', 'Al Hudaydah', 'Ibb', 'Dhamar', 'Al Mukalla', 'Sayyan', 'Zabid', 'Saywun',
    'Ash Shihr', 'Hajjah', 'Sadah', 'Al Bayda', 'Marib', 'Lahij', 'Saada', 'Al Ghaydah', 'Zinjibar', 'Ataq'
  ];
  break;


        // Add cases for other countries here
        default:
          this.cities = [];
          break;
      }
    } else {
      this.cities = []; // Reset cities if country control is not found
    }
  }
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }
  onFileClick(event: Event): void {
    if (this.fileInputImage) {
      this.fileInputImage.click();
    }
  }

  EventCreation() {
    if (this.eventForm.invalid) {
      // If the form is invalid, mark all fields as touched to display validation errors
      this.eventForm.markAllAsTouched();
      return; // Exit the function if the form is invalid
    }
    // Extract form values
    let formValue = this.eventForm.value;
    // Create a new EventModel instance
    const startDate = new Date(formValue.startDate);
    if (startDate <= new Date()) {
      this.toastr.error('Event Date must be in the future.');
      return;
    }
    // Check if endDate is after startDate
    const endDate = new Date(formValue.endDate);
    if (endDate <= startDate) {
      this.toastr.error('Event End Date Must Be After Start Date.');
      return;
    }

    let eventModel = new EventModel();

    eventModel.title = formValue.title;
    eventModel.description = formValue.description;
    eventModel.startDate = startDate;
    eventModel.endDate = endDate;
    eventModel.category = formValue.category;
    eventModel.country = formValue.country;
    eventModel.city = formValue.city;
    eventModel.link = formValue.link;
    // Create a new FormData object
    const formData: FormData = new FormData();

    // Append eventModel JSON string to FormData
    formData.append('eventModel', JSON.stringify(eventModel));

    // Append selected file to FormData
    if (this.selectedFiles != null) {
      for (let index = 0; index < this.selectedFiles.length; index++) {
        const file = this.selectedFiles[index];
        if (file.type.startsWith('image')) {
          formData.append('files', file, file.name);
        } else {
          // Show error if the file is not an image
          this.toastr.error('Only image files are allowed.');
          return;
        }
      }
    }
    // Send POST request to server
    this.http.post(`/Event/create-event`, formData)
      .pipe(
        catchError(error => {
          console.error('Error creating event:', error);
          let errorMessage = 'An error occurred while creating the event.';
          if (error.status === 400) {
            errorMessage = error.error; // Assuming the error message is sent in the response body
          }
          return throwError(errorMessage);
        })
      )
      .subscribe(async result => {
        // Reset form values
        this.eventForm.reset();
        // Show success toastr messag
        this.selectedFiles = null;
        if (this.fileInputImage) {
          this.fileInputImage.nativeElement.value = '';
        }
        this.toastr.success('Your Event was created successfully.');
      });
  }
}
