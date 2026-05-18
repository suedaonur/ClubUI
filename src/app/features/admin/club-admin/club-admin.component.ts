import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ClubService } from '../../../core/services/club.service';
import { PostService } from '../../../core/services/post.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-club-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './club-admin.component.html',
  styleUrl: './club-admin.component.css'
})
export class ClubAdminComponent implements OnInit {
  private authService = inject(AuthService);
  private clubService = inject(ClubService);
  private postService = inject(PostService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  myAdminClubs: any[] = []; // Sadece yöneticisi olduğum kulüpler
  
  // Modal ve Üye Yönetimi verileri
  showMembersModal = false;
  membersList: any[] = [];
  isLoadingMembers = false;

  // Form verileri
  newPost = {
    clubId: 0,
    title: '',
    content: ''
  };

  isSubmitting = false;

  ngOnInit(): void {
    this.loadAdminClubs();
  }

  loadAdminClubs() {
    const studentId = this.authService.currentUser()?.id;
    const targetClubId = Number(this.route.snapshot.paramMap.get('id'));

    if (studentId) {
      this.clubService.getMyClubs(studentId).subscribe({
        next: (data) => {
          // Sadece isAdmin yetkisi true olanları filtrele
          this.myAdminClubs = data.filter(c => c.isAdmin || c.IsAdmin);
          if(this.myAdminClubs.length > 0) {
             // Eğer URL'de bir kulüp ID'si belirtilmişse onu seç, yoksa ilkini seç
             const matchingClub = this.myAdminClubs.find(c => (c.clubId || c.id) === targetClubId);
             if (matchingClub) {
               this.newPost.clubId = matchingClub.clubId || matchingClub.id;
             } else {
               this.newPost.clubId = this.myAdminClubs[0].clubId || this.myAdminClubs[0].id;
             }
          }
        },
        error: (err) => console.error("Kulüpler çekilemedi", err)
      });
    }
  }

  openMembersModal(clubId: any) {
    const cid = Number(clubId);
    if (!cid) {
      alert("Lütfen önce geçerli bir kulüp seçin!");
      return;
    }
    this.showMembersModal = true;
    this.isLoadingMembers = true;
    this.clubService.getClubMembers(cid).subscribe({
      next: (data) => {
        this.membersList = data;
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error("Üyeler çekilemedi", err);
        alert("Üyeler getirilirken bir hata oluştu.");
        this.isLoadingMembers = false;
      }
    });
  }

  closeMembersModal() {
    this.showMembersModal = false;
    this.membersList = [];
  }

  onUpdatePermissions(member: any) {
    const updaterId = this.authService.currentUser()?.id;
    if (!updaterId) {
      alert("Lütfen işlem yapabilmek için önce giriş yapın!");
      return;
    }

    const payload = {
      id: member.id,
      updaterStudentId: updaterId,
      isAdmin: !!member.isAdmin,
      isWriteable: !!member.isWriteable,
      isRemoveableMember: !!member.isRemoveableMember
    };

    this.clubService.updateMemberPermissions(payload).subscribe({
      next: () => {
        alert(`${member.student?.fullName || 'Üye'} yetkileri başarıyla güncellendi! 🛡️`);
      },
      error: (err) => {
        console.error("Yetkiler güncellenemedi", err);
        const errMsg = err.error || "Bu üyenin yetkilerini değiştirmek için kulüp yöneticisi veya sahibi olmanız gerekir.";
        alert(errMsg);
      }
    });
  }

  onSubmitPost() {
    if (!this.newPost.clubId || !this.newPost.title || !this.newPost.content) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    this.isSubmitting = true;
    // Post atarken kendi StudentId'mizi de gönderiyoruz
    const studentId = this.authService.currentUser()?.id || 0;
    const postPayload = {
      ...this.newPost,
      studentId: studentId
    };

    this.postService.createPost(postPayload).subscribe({
      next: () => {
        alert("Gönderi başarıyla paylaşıldı! 🚀");
        this.isSubmitting = false;
        this.router.navigate(['/home']); // Anasayfaya git ki postunu gör
      },
      error: (err) => {
        console.error("Post atılamadı", err);
        alert("Gönderi paylaşılırken bir hata oluştu. Lütfen bu kulüpte paylaşım yapma (IsWriteable) yetkiniz olduğundan emin olun.");
        this.isSubmitting = false;
      }
    });
  }
}